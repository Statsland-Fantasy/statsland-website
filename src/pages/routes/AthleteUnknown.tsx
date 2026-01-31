import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams, useLocation } from "react-router";
import "./AthleteUnknown.css";
import type { SportType } from "@/features/athlete-unknown/config";
import {
  useGameState,
  useGuessSubmission,
  useTileFlip,
  useGameData,
  useShareResults,
  useRoundHistory,
  useUserStats,
} from "@/features/athlete-unknown/hooks";
import {
  SportsReferenceAttribution,
  SportSelectorHeader,
  RoundInfo,
  ScoreDisplay,
  PlayerInput,
  TileGrid,
  RoundResultsModal,
  RulesModal,
  UserStatsModal,
  HintTiles,
  RoundHistoryModal,
  UserAndSettings,
  Button,
  PreviousGuesses,
  GiveUpConfirmationModal,
  LoadingIndicator,
  RoundSplashModal,
  ErrorDisplay,
} from "@/features/athlete-unknown/components";
import {
  athleteUnknownApiService,
  migrateUserStats,
  UserSportStats,
} from "@/features";
import { getValidSport } from "@/features/athlete-unknown/utils/strings";
import { STORAGE_KEYS } from "@/features/athlete-unknown/utils/storage";
import { hasAnyGameData } from "@/features/athlete-unknown/utils";
import { config } from "@/config";
import { Navbar } from "@/components";
import { getCurrentFullUrl, getCurrentPath } from "@/utils";
// import PlaceholderLogo from "@/features/athlete-unknown/assets/placeholder-logo.png";

export function AthleteUnknown(): React.ReactElement {
  const { getAccessTokenSilently, isAuthenticated, user, loginWithRedirect } =
    useAuth0();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [migrationAttempted, setMigrationAttempted] = useState(false);
  const [username, setUsername] = useState("");
  const { sport } = useParams();
  const location = useLocation();

  // Extract roles from access token
  useEffect(() => {
    const extractUserInformation = async () => {
      try {
        const accessToken = await getAccessTokenSilently();

        // Decode JWT to get payload (JWT format: header.payload.signature)
        const base64Url = accessToken.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(window.atob(base64));

        const roles = payload["https://statslandfantasy.com/roles"] || [];
        const userMetadata =
          user?.["https://statslandfantasy.com/user_metadata"] || "";
        const { display_username: tokenUsername } = userMetadata;

        // Check localStorage first (may have updated username not yet in token)
        const storedUsername = localStorage.getItem(STORAGE_KEYS.USERNAME);
        const username = storedUsername || tokenUsername;

        console.log("[AthleteUnknown] Access Token username:", tokenUsername);
        console.log("[AthleteUnknown] Stored username:", storedUsername);
        console.log("[AthleteUnknown] Access Token roles:", roles);
        setUserRoles(roles);
        setUsername(username);
      } catch (error) {
        console.error("[AthleteUnknown] Error extracting roles:", error);
        setUserRoles([]);
        setUsername("");
      }
    };

    extractUserInformation();
  }, [getAccessTokenSilently, user]);

  // Set up Auth0 token for API calls
  useEffect(() => {
    athleteUnknownApiService.setGetAccessToken(getAccessTokenSilently);
  }, [getAccessTokenSilently]);

  // Migrate user stats from localStorage to backend after first login
  useEffect(() => {
    const attemptMigration = async () => {
      // Only attempt migration once per session and only for authenticated users
      if (!isAuthenticated || migrationAttempted) {
        return;
      }

      console.log("[API] ATTEMPT MIGRATION-------------------");

      setMigrationAttempted(true);

      try {
        const success = await migrateUserStats(user?.sub, username);

        if (success) {
          console.log(
            "[AthleteUnknown] Stats migration completed successfully"
          );
        } else {
          console.warn(
            "[AthleteUnknown] Stats migration failed, will retry on next login"
          );
        }
      } catch (error) {
        console.error("[AthleteUnknown] Error during stats migration:", error);
      }
    };

    attemptMigration();
  }, [isAuthenticated, migrationAttempted, user?.sub, username]);

  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("au-splash-shown");
  });
  const [activeSport, setActiveSport] = useState<SportType>(
    getValidSport(sport, config.athleteUnknown.sportsList[0])
  );
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isRoundResultsModalOpen, setIsRoundResultsModalOpen] = useState(false);
  const [isUserStatsModalOpen, setIsUserStatsModalOpen] = useState(false);
  const [isRoundHistoryModalOpen, setIsRoundHistoryModalOpen] = useState(false);
  const [isGiveUpConfirmationModalOpen, setIsGiveUpConfirmationModalOpen] =
    useState(false);
  const [selectedPlayDate, setSelectedPlayDate] = useState<string | undefined>(
    undefined
  );

  const shareUrl = useMemo(() => {
    return getCurrentFullUrl(location);
  }, [location]);

  // Check if user is a playtester
  const isPlaytester = useMemo(() => {
    return userRoles.includes("Playtester");
  }, [userRoles]);

  // Core state management - pass selectedPlayDate to ensure each puzzle has its own state
  const { state, updateState, clearProgress } = useGameState(
    activeSport,
    selectedPlayDate
  );

  // Data fetching & submission
  // updates the following fields in state
  // isRoundLoading, error, round
  useGameData({
    activeSport,
    state,
    updateState,
    playDate: selectedPlayDate,
    isGuest: !isAuthenticated,
  });

  // Game logic
  // updates the following fields in state:
  // message, messageType, previousCloseGuess, isCompleted, lastSubmittedGuess
  const { handleNameSubmit, handleGiveUp } = useGuessSubmission({
    state,
    updateState,
  });

  // Tile interactions
  // updates the following fields in state:
  // photoRevealed, returningFromPhoto, flippedTiles, score
  const { handleTileClick, handleHintTileClick } = useTileFlip({
    state,
    updateState,
  });

  // User Stats
  // updates the following fields in state:
  // userStats, editedUsername, username, isUserStatsLoading
  const { handleFetchUserStats, handleEditUsername, handleSaveEditedUsername } =
    useUserStats({
      state,
      updateState,
    });

  // Round History
  // updates the following fields in state
  // roundHistory
  const { handleFetchRoundHistory } = useRoundHistory({ updateState });

  // Share functionality
  // updates the following fields in state:
  // copiedText
  const { handleShare } = useShareResults({ state, updateState, shareUrl });

  useEffect(() => {
    setActiveSport(getValidSport(sport));
  }, [sport, setActiveSport]);

  // Show RulesModal for first-time users (after splash is dismissed)
  useEffect(() => {
    if (!showSplash && !hasAnyGameData()) {
      setIsRulesModalOpen(true);
    }
  }, [showSplash]);

  // Clear localStorage when round is completed
  useEffect(() => {
    if (state.isCompleted && state.round) {
      setIsRoundResultsModalOpen(true);
      clearProgress();
    }
  }, [
    state.isCompleted,
    state.round,
    clearProgress,
    setIsRoundResultsModalOpen,
  ]);

  // Fetch roundHistory when the modal is opened
  useEffect(() => {
    if (isRoundHistoryModalOpen) {
      handleFetchRoundHistory(activeSport, isPlaytester);
    }
  }, [
    activeSport,
    isPlaytester,
    isRoundHistoryModalOpen,
    handleFetchRoundHistory,
  ]);

  // Fetch user stats when the modal is opened
  useEffect(() => {
    if (isUserStatsModalOpen) {
      handleFetchUserStats();
    }
  }, [isUserStatsModalOpen, handleFetchUserStats]);

  const playDate = useMemo(() => {
    return state?.round?.playDate ?? "";
  }, [state.round]);

  const roundNumber = useMemo(() => {
    const roundId = state?.round?.roundId ?? "";
    const [, rNum] = roundId.split("#");
    return rNum;
  }, [state.round]);

  const userRoundHistoryArray = useMemo(() => {
    return state.userStats?.sports.filter((userSport: UserSportStats) => {
      return userSport.sport === activeSport;
    });
  }, [state.userStats, activeSport]);

  const handleSportAndDateChange = useCallback(
    (sport: SportType) => {
      setActiveSport(sport);
      setSelectedPlayDate(undefined); // undefined will fallback to current day
    },
    [setActiveSport, setSelectedPlayDate]
  );

  const handleSplashScreenContinue = useCallback(() => {
    sessionStorage.setItem("au-splash-shown", "true");
    setShowSplash(false);
  }, [setShowSplash]);

  const handleLogin = useCallback(() => {
    loginWithRedirect({
      appState: {
        returnTo: getCurrentPath(location),
      },
    });
  }, [loginWithRedirect, location]);

  // console.log("STATE AU", state);

  return (
    <div className="au-container">
      <div className="au-header-container">
        <div className="au-left-header-container">
          <Navbar />
          {/* <img
            src={PlaceholderLogo}
            alt="Athlete Unknown Logo"
            className="au-placeholder-logo"
          /> */}
        </div>
        <UserAndSettings
          onStatsClick={() => setIsUserStatsModalOpen(true)}
          onRoundResultsClick={() => setIsRoundResultsModalOpen(true)}
          onRulesClick={() => setIsRulesModalOpen(true)}
          onRoundHistoryClick={() => setIsRoundHistoryModalOpen(true)}
        />
      </div>
      <div className="au-body-container">
        <SportSelectorHeader
          activeSport={activeSport}
          onSportChange={handleSportAndDateChange}
        />
        {!state.isRoundLoading && state.round && (
          <>
            <RoundInfo
              roundNumber={roundNumber}
              playDate={playDate}
              theme={state.round.theme}
              sport={activeSport}
              onRoundResultsClick={() => setIsRoundResultsModalOpen(true)}
              onRulesClick={() => setIsRulesModalOpen(true)}
              onRoundHistoryClick={() => setIsRoundHistoryModalOpen(true)}
            />

            <div className="au-paper-container">
              <div className="au-player-guess-container">
                <PlayerInput
                  playerName={state.playerName}
                  isCompleted={state.isCompleted}
                  onPlayerNameChange={(name) =>
                    updateState({ playerName: name })
                  }
                  onSubmit={handleNameSubmit}
                />
                <PreviousGuesses
                  guesses={state.previousGuesses}
                  correctName={state.round.player.name}
                />
              </div>
            </div>
            <div className="au-game-container au-bulletin-board">
              <div className="au-scoring-container">
                <div className="au-scoring-buttons-container">
                  <Button
                    onClick={handleNameSubmit}
                    size="lg"
                    variant={state.isCompleted ? "ghost" : "primary"}
                    disabled={state.isCompleted || state.playerName === ""}
                  >
                    Submit
                  </Button>
                  <Button
                    onClick={() => setIsGiveUpConfirmationModalOpen(true)}
                    size="md"
                    variant={state.isCompleted ? "ghost" : "danger"}
                    disabled={state.isCompleted}
                  >
                    Give Up
                  </Button>
                </div>
                <ScoreDisplay score={state.score} />
                <div className="au-hints-container">
                  <HintTiles
                    flippedTiles={state.flippedTiles}
                    playerData={state.round.player}
                    onHintTileClick={handleHintTileClick}
                  />
                </div>
              </div>
              <div className="au-tile-grid-container">
                <TileGrid
                  flippedTiles={state.flippedTiles}
                  photoRevealed={state.photoRevealed}
                  returningFromPhoto={state.returningFromPhoto}
                  playerData={state.round.player}
                  onTileClick={handleTileClick}
                />
              </div>
            </div>
          </>
        )}
      </div>
      {!state.isRoundLoading && state.round && (
        <div className="au-footer-container">
          <SportsReferenceAttribution activeSport={activeSport} />
          <div>Credits</div>
        </div>
      )}

      {state.isRoundLoading && (
        <div className="au-round-loading-container">
          <LoadingIndicator color="white" />
        </div>
      )}

      {state.error && <ErrorDisplay error={state.error} />}

      <RoundSplashModal
        isOpen={showSplash}
        isLoading={state.isRoundLoading}
        sport={activeSport}
        playDate={selectedPlayDate}
        username={state.username || username} // prioritize state.username in case username was edited in-game
        onLogin={handleLogin}
        onContinue={handleSplashScreenContinue}
      />

      {state.round && (
        <RoundResultsModal
          isOpen={isRoundResultsModalOpen}
          score={state.score}
          flippedTiles={
            state.isCompleted
              ? state.flippedTilesUponCompletion
              : state.flippedTiles
          }
          copiedText={state.copiedText}
          round={state.round}
          onClose={() => setIsRoundResultsModalOpen(false)}
          onShare={handleShare}
          isCompleted={state.isCompleted}
          sport={activeSport}
          roundNumber={roundNumber}
          playDate={playDate}
          username={state.username || username} // prioritize state.username in case username was edited in-game
          onLogin={handleLogin}
        />
      )}

      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />

      <UserStatsModal
        isOpen={isUserStatsModalOpen}
        onClose={() => setIsUserStatsModalOpen(false)}
        userStats={state.userStats}
        username={state.username || username} // prioritize state.username in case username was edited in-game
        editedUsername={state.editedUsername}
        onEditUsername={handleEditUsername}
        onSaveEditedUsername={handleSaveEditedUsername}
        onLogin={handleLogin}
        isLoading={state.isUserStatsLoading}
        error={state.error}
      />

      <RoundHistoryModal
        isOpen={isRoundHistoryModalOpen}
        onClose={() => setIsRoundHistoryModalOpen(false)}
        isLoading={state.isRoundHistoryLoading}
        error={state.error}
        roundHistory={state.roundHistory}
        userRoundHistory={userRoundHistoryArray?.[0]?.history ?? []}
        onRoundSelect={(playDate) => setSelectedPlayDate(playDate)}
      />

      <GiveUpConfirmationModal
        isOpen={isGiveUpConfirmationModalOpen}
        onConfirm={handleGiveUp}
        onCancel={() => setIsGiveUpConfirmationModalOpen(false)}
      />
    </div>
  );
}
