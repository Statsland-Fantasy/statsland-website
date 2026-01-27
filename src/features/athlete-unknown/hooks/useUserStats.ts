/**
 * User stats hook
 * Handles fetching user stats
 */

import { useCallback } from "react";
import { userStatsService } from "@/features/athlete-unknown/services";
import type { GameState } from "./useGameState";

interface UseUserStatsProps {
  state: GameState;
  updateState: (patch: Partial<GameState>) => void;
}

export const useUserStats = ({ state, updateState }: UseUserStatsProps) => {
  const handleFetchUserStats = useCallback(async () => {
    try {
      updateState({ isLoading: true, error: null });

      const userStats = await userStatsService.getUserStats();

      updateState({
        userStats,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.log("Error retrieving user stats: ", error);
      updateState({
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve user stats",
        isLoading: false,
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

  const handleSaveEditedUsername = useCallback(() => {
    // first call Auth0 API to save username. If sucessful, then can update username state too
    updateState({
      username: state.editedUsername,
      editedUsername: "",
    });
  }, [updateState, state]);

  return {
    handleFetchUserStats,
    handleEditUsername,
    handleSaveEditedUsername,
  };
};
