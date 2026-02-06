import React, { useState, useEffect } from "react";
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
  const [isHovered, setIsHovered] = useState(false);
  const [isClickShown, setIsClickShown] = useState(isClose);

  useEffect(() => {
    if (isClickShown) {
      const timeout = setTimeout(() => setIsClickShown(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [isClickShown]);

  return (
    <div
      className={`au-previous-guess ${isCorrect ? "au-previous-guess--correct" : isClose ? "au-previous-guess--close" : ""}`}
      onClick={() => isClose && setIsClickShown(true)}
      onMouseEnter={() => isClose && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {guess}
      {isClose && (isHovered || isClickShown) && (
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
  const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
  const displayedGuesses = guesses.slice(isDesktop ? -4 : -2);
  const isZeroGuesses = guesses.length === 0;
  if (isZeroGuesses) {
    displayedGuesses.push("placeholder");
  }

  return (
    <div className="au-previous-guesses-container">
      <span className="au-previous-guesses-title au-mobile-invisible">
        Previous <br />
        Guesses
      </span>
      <div
        className={`au-previous-guesses ${isZeroGuesses ? "au-desktop-placeholder" : ""}`}
      >
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
    </div>
  );
}
