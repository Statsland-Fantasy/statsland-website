import React, { useState, useEffect, useCallback } from "react";
import {
  calculateLevenshteinDistance,
  normalize,
} from "@/features/athlete-unknown/utils";
import { GUESS_ACCURACY } from "@/features/athlete-unknown/config";

interface PreviousGuessesProps {
  guesses: string[];
  correctName: string;
}

interface GuessItemProps {
  guess: string;
  isCorrect: boolean;
  isClose: boolean;
  distance: number;
}

function GuessItem({
  guess,
  isCorrect,
  isClose,
  distance,
}: GuessItemProps): React.ReactElement {
  const [showTooltip, setShowTooltip] = useState(isClose);

  useEffect(() => {
    if (showTooltip) {
      const timeout = setTimeout(() => setShowTooltip(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [showTooltip]);

  const handleInteraction = useCallback(() => {
    if (isClose) {
      setShowTooltip(true);
    }
  }, [isClose]);

  return (
    <div
      className={`au-previous-guess ${isCorrect ? "au-previous-guess--correct" : isClose ? "au-previous-guess--close" : ""}`}
      onClick={handleInteraction}
      onMouseEnter={handleInteraction}
    >
      {guess}
      {isClose && showTooltip && (
        <span className="au-previous-guess-tooltip">
          Spelling is off by {distance} letter{distance !== 1 ? "s" : ""}!
        </span>
      )}
    </div>
  );
}

export function PreviousGuesses({
  guesses,
  correctName,
}: PreviousGuessesProps): React.ReactElement | null {
  if (guesses.length === 0) {
    return null;
  }

  // Only show the last 2 guesses
  const displayedGuesses = guesses.slice(-2);

  return (
    <div className="au-previous-guesses">
      {displayedGuesses.map((guess, index) => {
        const distance = calculateLevenshteinDistance(
          normalize(guess),
          normalize(correctName)
        );
        const isCorrect = distance === 0;
        const isClose = distance <= GUESS_ACCURACY.VERY_CLOSE_DISTANCE;

        return (
          <GuessItem
            key={index}
            guess={guess}
            isCorrect={isCorrect}
            isClose={isClose}
            distance={distance}
          />
        );
      })}
    </div>
  );
}
