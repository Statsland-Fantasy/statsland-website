/**
 * Round history hook
 * Handles fetching rounds or upcoming rounds based on user role
 */

import { useCallback } from "react";
import { roundsService } from "@/features/athlete-unknown/services";
import type { GameState } from "./useGameState";
import { SportType } from "@/config";

interface UseRoundHistoryProps {
  updateState: (patch: Partial<GameState>) => void;
}

export const useRoundHistory = ({ updateState }: UseRoundHistoryProps) => {
  const handleFetchRoundHistory = useCallback(
    async (sport: SportType, isPlaytester: boolean) => {
      try {
        updateState({ isRoundHistoryLoading: true, error: null });

        const roundHistory = isPlaytester
          ? await roundsService.getUpcomingRounds(sport)
          : await roundsService.getRounds(sport);

        updateState({
          roundHistory,
          isRoundHistoryLoading: false,
          error: null,
        });
      } catch (error) {
        console.log("Error retrieving round history: ", error);
        updateState({
          error:
            error instanceof Error
              ? error.message
              : "Failed to retrieve round history",
          isRoundHistoryLoading: false,
        });
      }
    },

    [updateState]
  );

  return {
    handleFetchRoundHistory,
  };
};
