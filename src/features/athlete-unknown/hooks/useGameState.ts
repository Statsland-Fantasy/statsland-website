/**
 * Core game state management hook
 * Manages game state for all sports and dates, provides update functions
 */

import { useState, useCallback, useEffect } from "react";
import type {
  Round,
  RoundSummary,
  UserStats,
} from "@/features/athlete-unknown/types";
import type {
  GuessMessageType,
  SportType,
  TileType,
} from "@/features/athlete-unknown/config";
import { INITIAL_SCORE } from "@/features/athlete-unknown/config";
import {
  loadMidRoundProgress,
  saveMidRoundProgress,
  clearMidRoundProgress,
  type MidRoundProgress,
  getCurrentDateString,
} from "@/features/athlete-unknown/utils";

export interface GameState {
  round: Round | null;
  userStats: UserStats | null;
  playerName: string;
  message: string;
  messageType: GuessMessageType;
  previousCloseGuess: string;
  flippedTiles: TileType[];
  flippedTilesUponCompletion: TileType[];
  photoRevealed: boolean;
  returningFromPhoto: boolean;
  score: number;
  isCompleted: boolean;
  previousGuesses: string[];
  incorrectGuesses: number;
  copiedText: string;
  lastSubmittedGuess: string;
  error: string | null;
  currentPlayerIndex?: number;
  roundHistory: RoundSummary[];
  username: string;
  editedUsername: string;
  isRoundLoading: boolean;
  isRoundHistoryLoading: boolean;
  isUserStatsLoading: boolean;
}

const createInitialState = (): GameState => ({
  round: null,
  userStats: null,
  playerName: "",
  message: "",
  messageType: "",
  previousCloseGuess: "",
  flippedTiles: [],
  flippedTilesUponCompletion: [],
  photoRevealed: false,
  returningFromPhoto: false,
  score: INITIAL_SCORE,
  isCompleted: false,
  previousGuesses: [],
  incorrectGuesses: 0,
  copiedText: "",
  lastSubmittedGuess: "",
  error: null,
  roundHistory: [],
  username: "",
  editedUsername: "",
  isRoundLoading: false,
  isRoundHistoryLoading: false,
  isUserStatsLoading: false,
});

/**
 * Convert GameState to MidRoundProgress for localStorage
 */
const gameStateToProgress = (
  state: GameState,
  sport: SportType,
  playDate: string
): MidRoundProgress => ({
  sport,
  playDate,
  isCompleted: state.isCompleted,
  flippedTiles: state.flippedTiles,
  previousGuesses: state.previousGuesses,
  incorrectGuesses: state.incorrectGuesses,
  lastSubmittedGuess: state.lastSubmittedGuess,
  message: state.message,
  messageType: state.messageType,
  playerName: state.playerName,
  previousCloseGuess: state.previousCloseGuess,
  score: state.score,
});

/**
 * Convert MidRoundProgress to partial GameState for loading
 */
const progressToGameState = (
  progress: MidRoundProgress
): Partial<GameState> => ({
  isCompleted: progress.isCompleted,
  flippedTiles: progress.flippedTiles,
  incorrectGuesses: progress.incorrectGuesses,
  previousGuesses: progress.previousGuesses,
  lastSubmittedGuess: progress.lastSubmittedGuess,
  message: progress.message,
  messageType: progress.messageType,
  playerName: progress.playerName,
  previousCloseGuess: progress.previousCloseGuess,
  score: progress.score,
});

export const useGameState = (activeSport: SportType, playDate?: string) => {
  // Key by sport + playDate to ensure each puzzle has its own state
  // If no playDate provided, use today's date so each day gets its own state
  const effectivePlayDate = playDate || getCurrentDateString();
  const stateKey = `${activeSport}_${effectivePlayDate}`;

  const [gameStates, setGameStates] = useState<Record<string, GameState>>({});

  // Initialize state for current key if it doesn't exist
  // Load from localStorage if available
  useEffect(() => {
    setGameStates((prev) => {
      if (!prev[stateKey]) {
        // Try to load saved progress from localStorage
        const savedProgress = loadMidRoundProgress(
          activeSport,
          effectivePlayDate
        );

        if (savedProgress) {
          console.log(
            `[useGameState] Loading saved progress for ${activeSport} on ${effectivePlayDate}`
          );
          const initialState = createInitialState();
          const restoredState = {
            ...initialState,
            ...progressToGameState(savedProgress),
          };
          return {
            ...prev,
            [stateKey]: restoredState,
          };
        }

        return {
          ...prev,
          [stateKey]: createInitialState(),
        };
      }
      return prev;
    });
  }, [stateKey, activeSport, effectivePlayDate]);

  const currentState = gameStates[stateKey] || createInitialState();

  const updateState = useCallback(
    (patch: Partial<GameState>) => {
      setGameStates((prev) => {
        const currentSportState = prev[stateKey] || createInitialState();
        const newState = { ...currentSportState, ...patch };

        // Preserve currentPlayerIndex if not in patch
        if (
          newState.currentPlayerIndex === undefined &&
          currentSportState.currentPlayerIndex !== undefined
        ) {
          newState.currentPlayerIndex = currentSportState.currentPlayerIndex;
        }

        // Save progress to localStorage after state update
        // Only save if updating game-progress fields (not just loading/error states)
        const isGameProgressUpdate =
          patch.flippedTiles !== undefined ||
          patch.previousGuesses !== undefined ||
          patch.score !== undefined ||
          patch.isCompleted !== undefined ||
          patch.playerName !== undefined ||
          patch.incorrectGuesses !== undefined ||
          patch.message !== undefined ||
          patch.lastSubmittedGuess !== undefined;

        if (isGameProgressUpdate && !newState.isCompleted) {
          const progress = gameStateToProgress(
            newState,
            activeSport,
            effectivePlayDate
          );
          saveMidRoundProgress(activeSport, effectivePlayDate, progress);
        }

        return {
          ...prev,
          [stateKey]: newState,
        };
      });
    },
    [stateKey, activeSport, effectivePlayDate]
  );

  const resetState = useCallback(() => {
    updateState(createInitialState());
  }, [updateState]);

  const clearProgress = useCallback(() => {
    clearMidRoundProgress(activeSport, effectivePlayDate);
    console.log(
      `[useGameState] Cleared saved progress for ${activeSport} on ${effectivePlayDate}`
    );
  }, [activeSport, effectivePlayDate]);

  return {
    state: currentState,
    updateState,
    resetState,
    clearProgress,
    allStates: gameStates,
  };
};
