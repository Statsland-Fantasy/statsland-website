import React, { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { PlayerData } from "@/features/athlete-unknown/types";
import {
  REFERENCE_URLS,
  SportType,
  TILE_NAMES,
  TILES,
  TileType,
} from "@/features/athlete-unknown/config";

interface TileProps {
  tileName: TileType;
  index: number;
  isFlipped: boolean;
  photoRevealed: boolean;
  returningFromPhoto: boolean;
  playerData: PlayerData;
  photoSegmentStyle?: React.CSSProperties;
  onClick: () => void;
}

export function Tile({
  tileName,
  isFlipped,
  photoRevealed,
  returningFromPhoto,
  playerData,
  photoSegmentStyle,
  onClick,
}: TileProps): React.ReactElement {
  const photoUrl = playerData.photo || "";
  const tileContent = String(playerData[tileName] || "");

  const getAdvancedStatsUrl = useCallback((sport: SportType) => {
    return REFERENCE_URLS[sport];
  }, []);

  return (
    <div className="tile" onClick={onClick}>
      <div
        className={`tile-inner ${
          photoRevealed
            ? "photo-reveal"
            : returningFromPhoto
              ? isFlipped
                ? "flipped no-slide-anim returning-from-photo"
                : "returning-from-photo"
              : isFlipped
                ? "flipped"
                : ""
        }`}
      >
        <div className="tile-front evidence-tag">
          <div className="reinforcement-ring"></div>
          <p className="evidence-tag-text">{TILES[tileName].label}</p>
        </div>

        <div
          className={`tile-back ${photoRevealed ? "photo-segment investigation-evidence" : ""}`}
          style={photoRevealed ? photoSegmentStyle : {}}
        >
          {!photoRevealed && tileName === TILE_NAMES.PHOTO && (
            <img
              src={photoUrl}
              alt="Player"
              className="tile-mini-photo investigation-evidence"
            />
          )}
          {!photoRevealed && tileName !== TILE_NAMES.PHOTO && (
            <div>
              <span>
                {tileContent}
                {tileName === TILE_NAMES.CAREER_STATS && isFlipped && (
                  <a
                    href={getAdvancedStatsUrl(playerData.sport)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tile-info-link"
                    onClick={(e) => e.stopPropagation()}
                    title="Learn about advanced stats"
                  >
                    <FontAwesomeIcon icon={faCircleInfo} />
                  </a>
                )}
              </span>
            </div>
          )}
          {/* {photoRevealed && index === 2 && (
            <div className="flip-back-arrow">
              <FontAwesomeIcon icon={faArrowRotateLeft} />
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
