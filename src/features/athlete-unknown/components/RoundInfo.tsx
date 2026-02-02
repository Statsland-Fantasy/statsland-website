import React from "react";
import { SportType } from "@/config";
import { getSportEmoji } from "../utils/strings";
import { roundPlayDatePrint } from "../utils/date";

interface RoundInfoProps {
  roundNumber: string;
  playDate: string;
  theme?: string;
  sport: SportType;
}

export function RoundInfo({
  roundNumber,
  playDate,
  theme,
  sport,
}: RoundInfoProps): React.ReactElement {
  return (
    <div className="au-round-info-container">
      <div
        className="au-round-info-container-top"
        style={{ width: theme ? "100%" : "75%" }}
      >
        <span className="au-round-number">
          <p>{`Case #${getSportEmoji(sport)}${roundNumber}`}</p>
        </span>
        <span className="au-separator">•</span>
        <span className="au-round-date">
          <p>{roundPlayDatePrint(playDate)}</p>
        </span>
      </div>
      <div className="au-round-info-container-bottom">
        <p>{theme}</p>
      </div>
    </div>
  );
}
