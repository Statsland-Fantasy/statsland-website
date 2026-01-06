import React from "react";
import { TILE_NAMES } from "@/features/athlete-unknown/config";
import type { RoundStats, PlayerData } from "@/features/athlete-unknown/types";

const formatTileName = (tileName: string): string => {
  if (!tileName) {
    return "";
  }
  return tileName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

interface ResultsModalProps {
  isOpen: boolean;
  score: number;
  flippedTiles: boolean[];
  copiedText: string;
  roundStats: RoundStats | null;
  playerData: PlayerData;
  onClose: () => void;
  onShare: () => void;
  isCompleted: boolean;
}

export function RoundResultsModal({
  isOpen,
  score,
  flippedTiles,
  copiedText,
  roundStats,
  playerData,
  onClose,
  onShare,
  isCompleted,
}: ResultsModalProps): React.ReactElement | null {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="results-modal" onClick={onClose}>
      <div
        className="results-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-results" onClick={onClose}>
          ✕
        </button>
        <div>
          <h2 className="results-title">
            {isCompleted ? "Case Closed" : "Case Open"}
            {/* {`Your score is ${score}!`} */}
          </h2>

          <div className="player-info-section">
            {isCompleted ? (
              <a
                href={playerData.sportsReferenceURL}
                target="_blank"
                rel="noopener noreferrer"
                className="player-name-link"
              >
                {playerData.name}
              </a>
            ) : (
              <p className="player-name-link">?????</p>
            )}

            {isCompleted && playerData.photo ? (
              <img
                src={playerData.photo}
                alt={playerData.name}
                className="player-photo"
              />
            ) : (
              <img
                src="/test-unknown-person.jpg"
                alt="unknown-player"
                className="player-photo"
              />
            )}
          </div>

          {isCompleted && (
            <>
              <h2 className="results-title">{`Your Score: ${score}`}</h2>

              <div className="results-grid">
                {TILE_NAMES.map((tileName, index) => (
                  <div
                    key={index}
                    className={`results-tile ${flippedTiles[index] ? "flipped" : "unflipped"}`}
                  >
                    {flippedTiles[index]
                      ? tileName === "photo"
                        ? "📷"
                        : "↻"
                      : ""}
                  </div>
                ))}
              </div>

              <button className="share-button" onClick={onShare}>
                Share
              </button>

              {copiedText && (
                <div className="copied-message">
                  <pre>{copiedText}</pre>
                  <p>has been copied</p>
                </div>
              )}
            </>
          )}
        </div>

        {roundStats && (
          <div className="round-stats-section">
            <h3>Today's Round Stats</h3>
            <div className="round-stats-grid">
              <div className="round-stat-item">
                <div className="round-stat-label">Games Played</div>
                <div className="round-stat-value">{roundStats.totalPlays}</div>
              </div>
              <div className="round-stat-item">
                <div className="round-stat-label">Win Rate</div>
                <div className="round-stat-value">
                  {roundStats.percentageCorrect}%
                </div>
              </div>
              <div className="round-stat-item">
                <div className="round-stat-label">Average Score</div>
                <div className="round-stat-value">
                  {roundStats.averageCorrectScore}
                </div>
              </div>
              <div className="round-stat-item">
                <div className="round-stat-label">High Score</div>
                <div className="round-stat-value">
                  {roundStats.highestScore}%
                </div>
              </div>
              <div className="round-stat-item">
                <div className="round-stat-label">
                  Average # of Tiles Flipped
                </div>
                <div className="round-stat-value">
                  {roundStats.averageNumberOfTileFlips}%
                </div>
              </div>
            </div>
            <h4>Tile Statistics</h4>
            <div className="round-stats-grid">
              <div className="round-stat-item">
                <div className="round-stat-label">
                  Most Common First Tile Flipped
                </div>
                <div className="round-stat-value">
                  {formatTileName(roundStats.mostCommonFirstTileFlipped)}
                </div>
              </div>
              <div className="round-stat-item">
                <div className="round-stat-label">
                  Most Common Last Tile Flipped
                </div>
                <div className="round-stat-value">
                  {formatTileName(roundStats.mostCommonLastTileFlipped)}
                </div>
              </div>
              <div className="round-stat-item">
                <div className="round-stat-label">Most Common Tile Flipped</div>
                <div className="round-stat-value">
                  {formatTileName(roundStats.mostCommonTileFlipped)}
                </div>
              </div>
              <div className="round-stat-item">
                <div className="round-stat-label">
                  Least Common Tile Flipped
                </div>
                <div className="round-stat-value">
                  {formatTileName(roundStats.leastCommonTileFlipped)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
