import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faBriefcase,
  faChartLine,
  faUserSecret,
  faVolumeHigh,
  faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useAudio } from "@/pages/providers";
import { MUSIC_PLAYLIST } from "../config";
import { useMemo } from "react";

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
        <FontAwesomeIcon icon={faBookOpen} size="xl" onClick={onRulesClick} />
      </button>
      <button className="au-icon-button">
        <FontAwesomeIcon
          icon={faChartLine}
          size="xl"
          onClick={onRoundResultsClick}
        />
      </button>
      <button className="au-icon-button">
        <FontAwesomeIcon
          icon={faBriefcase}
          size="xl"
          onClick={onRoundHistoryClick}
        />
      </button>
      <button onClick={onStatsClick} className="au-icon-button">
        <FontAwesomeIcon icon={faUserSecret} size="xl" />
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
        <FontAwesomeIcon icon={icon} size="xl" />
      </button>
    </div>
  );
}
