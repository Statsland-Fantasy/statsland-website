import React from "react";
import { formatDate } from "../../utils/formatting";

interface RoundInfoProps {
  roundNumber: number;
  playDate?: string;
  onRoundStatsClick: () => void;
  onRulesClick: () => void;
}

export const RoundInfo: React.FC<RoundInfoProps> = ({
  roundNumber,
  playDate,
  onRoundStatsClick,
  onRulesClick,
}) => {
  return (
    <div className="puzzle-info">
      <span className="puzzle-number">Puzzle #{roundNumber}</span>
      {playDate && (
        <>
          <span className="separator">•</span>
          <span className="puzzle-date">{formatDate(playDate)}</span>
        </>
      )}
      <span className="separator">•</span>
      <button className="round-stats-link" onClick={onRoundStatsClick}>
        Today's Stats
      </button>
      <span className="separator">•</span>
      <button className="rules-link" onClick={onRulesClick}>
        Rules
      </button>
    </div>
  );
};
