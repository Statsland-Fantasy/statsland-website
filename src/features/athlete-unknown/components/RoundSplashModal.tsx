import { useEffect, useMemo } from "react";
import { config, SportType } from "@/config";
import { getSportEmoji, daysBetween, getCurrentDateString } from "../utils";
import { useAudio } from "@/pages/providers";
import { MUSIC_PLAYLIST } from "../config";
import { useAuth0 } from "@auth0/auth0-react";
import {
  faMagnifyingGlass,
  faVolumeHigh,
  faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SLLogoStar from "../assets/SL_Logo_Star_Color.svg";
import { roundPlayDatePrint } from "../utils/date";
import AULogo from "@/features/athlete-unknown/assets/Athlete-Unknown-Logo.svg";

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
        <img
          src={AULogo}
          alt="athlete-unknown-logo"
          className="au-splash-logo"
        />
        <p className="au-splash-subtitle">
          Use the clues to solve the mystery...
        </p>

        <button
          className="au-splash-play-btn"
          onClick={onContinue}
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} size="sm" />
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
          <p className="au-splash-date">
            {roundPlayDatePrint(playDate)}{" "}
            <div className="au-splash-separator">•</div>
            {`Case #${getSportEmoji(sport)}${daysBetween(config.athleteUnknown.firstRoundDate, playDate) + 1}`}
          </p>
        </div>
      </div>

      <div className="au-splash-footer">
        <img
          src={SLLogoStar}
          alt="Statsland Logo"
          className="au-splash-footer-logo"
        />
        <span className="au-splash-footer-text">A Statsland Attraction</span>
      </div>
    </div>
  );
}
