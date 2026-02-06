import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faBriefcase,
  faChartLine,
  faVolumeHigh,
  faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useAudio } from "@/pages/providers";
import { MUSIC_PLAYLIST } from "../config";
import { useMemo } from "react";
import UnknownLogo from "@/features/athlete-unknown/assets/Unknown-Logo.svg";

interface UserAndSettingsProps {
  onStatsClick: () => void;
  onRoundResultsClick: () => void;
  onRulesClick: () => void;
  onRoundHistoryClick: () => void;
}

export function UserAndSettings({
  onStatsClick,
  onRoundHistoryClick,
  onRulesClick,
  onRoundResultsClick,
}: UserAndSettingsProps): React.ReactElement {
  const { soundEnabled, isMuted, startSound, toggleMute } = useAudio();

  const icon = useMemo(() => {
    return !soundEnabled || isMuted ? faVolumeXmark : faVolumeHigh;
  }, [soundEnabled, isMuted]);

  return (
    <div className="au-user-settings-container">
      <button className="au-icon-button">
        <FontAwesomeIcon icon={faBookOpen} onClick={onRulesClick} />
      </button>
      <button className="au-icon-button">
        <FontAwesomeIcon icon={faChartLine} onClick={onRoundResultsClick} />
      </button>
      <button className="au-icon-button">
        <FontAwesomeIcon icon={faBriefcase} onClick={onRoundHistoryClick} />
      </button>
      <button onClick={onStatsClick} className="au-icon-button">
        <img
          src={UnknownLogo}
          alt="Unknown Detective Logo"
          className="au-unknown-icon-button"
        />
      </button>
      <button
        className="au-icon-button"
        onClick={() => {
          if (!soundEnabled) {
            startSound(MUSIC_PLAYLIST, false);
          } else {
            toggleMute();
          }
        }}
      >
        <FontAwesomeIcon icon={icon} />
      </button>
    </div>
  );
}
