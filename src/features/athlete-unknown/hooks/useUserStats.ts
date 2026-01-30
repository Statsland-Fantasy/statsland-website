/**
 * User stats hook
 * Handles fetching user stats
 */

import { useCallback } from "react";
import { toast } from "sonner";
import {
  athleteUnknownApiService,
  userStatsService,
} from "@/features/athlete-unknown/services";
import { STORAGE_KEYS } from "@/features/athlete-unknown/utils/storage";
import type { GameState } from "./useGameState";

interface UseUserStatsProps {
  state: GameState;
  updateState: (patch: Partial<GameState>) => void;
}

export const useUserStats = ({ state, updateState }: UseUserStatsProps) => {

  const handleFetchUserStats = useCallback(async () => {
    try {
      updateState({ isUserStatsLoading: true, error: null });

      const userStats = await userStatsService.getUserStats();

      updateState({
        userStats,
        isUserStatsLoading: false,
        error: null,
      });
    } catch (error) {
      console.log("Error retrieving user stats: ", error);
      updateState({
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve user stats",
        isUserStatsLoading: false,
      });
    }
  }, [updateState]);

  const handleEditUsername = useCallback(
    (editedUsername: string) => {
      updateState({
        editedUsername,
      });
    },
    [updateState]
  );

  const handleSaveEditedUsername = useCallback(async () => {
    // first call Auth0 API to save username. If sucessful, then can update username state too
    try {
      updateState({ error: null });
      await athleteUnknownApiService.updateUsername(state.editedUsername);
      // Persist to localStorage so it survives page refresh (token may have stale value)
      localStorage.setItem(STORAGE_KEYS.USERNAME, state.editedUsername);
      updateState({
        username: state.editedUsername,
        editedUsername: "",
        error: null,
      });
      toast.success("Username saved");
    } catch (error) {
      console.error("Failed to update username");
      updateState({
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve user stats",
      });
      toast.error("Failed to save username");
    }
  }, [updateState, state]);

  return {
    handleFetchUserStats,
    handleEditUsername,
    handleSaveEditedUsername,
  };
};
