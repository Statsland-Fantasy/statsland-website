import { useMemo } from "react";
import { config, SportType } from "@/config";
import { getSportEmoji, daysBetween, getCurrentDateString } from "../utils";
import { useAudio } from "@/pages/providers";
import { MUSIC_PLAYLIST } from "../config";
import { useAuth0 } from "@auth0/auth0-react";
import { faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface RoundSplashModalProps {
  isOpen: boolean;
  isLoading: boolean;
  sport: SportType;
  playDate: string | undefined;
  username: string;
  onContinue?: () => void;
  onLogin: () => void;
}

export function RoundSplashModal({
  isOpen,
  isLoading,
  sport,
  playDate = getCurrentDateString(),
  username,
  onContinue,
  onLogin,
}: RoundSplashModalProps): React.ReactElement | null {
  const { soundEnabled, isMuted, startSound, toggleMute } = useAudio();
  const { isAuthenticated } = useAuth0();

  const icon = useMemo(() => {
    const iconType = !soundEnabled || isMuted ? faVolumeXmark : faVolumeHigh;
    return <FontAwesomeIcon icon={iconType} size="sm" />;
  }, [soundEnabled, isMuted]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="au-splash-overlay">
      <div className="au-splash-content">
        <h1 className="au-splash-title">Athlete Unknown Logo</h1>
        <p className="au-splash-subtitle">
          Use the clues and solve the mystery... (type it out)
        </p>

        <button
          className="au-splash-play-btn"
          onClick={onContinue}
          disabled={isLoading}
        >
          Play
        </button>

        <button
          className="au-splash-sound-btn"
          onClick={() => {
            if (!soundEnabled) {
              startSound(MUSIC_PLAYLIST, false);
            } else {
              toggleMute();
            }
          }}
        >
          {icon}

          {!soundEnabled || isMuted ? "Sound Off" : "Sound On"}
        </button>

        {isAuthenticated ? (
          <p className="au-splash-login-prompt">{`${username} is back on the case!`}</p>
        ) : (
          <>
            <p className="au-splash-login-prompt">Want to track your stats?</p>
            <button className="au-splash-login-btn" onClick={onLogin}>
              Login
            </button>
          </>
        )}

        <div className="au-splash-meta">
          <p className="au-splash-round-label">{`Case #${getSportEmoji(sport)}${daysBetween(config.athleteUnknown.firstRoundDate, playDate) + 1}`}</p>
          <p className="au-splash-date">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="au-splash-footer">
        <span className="au-splash-footer-text">A Statsland Attraction</span>
      </div>
    </div>
  );
}
