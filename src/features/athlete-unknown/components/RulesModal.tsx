import React, { useState, useEffect } from "react";
import {
  INCORRECT_GUESS_PENALTY,
  INITIAL_SCORE,
} from "@/features/athlete-unknown/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faBriefcase,
  faChartLine,
  faUserSecret,
  faVolumeHigh,
} from "@fortawesome/free-solid-svg-icons";

const ICON_EXPLANATIONS = [
  { icon: faBookOpen, label: "How to Play" },
  { icon: faChartLine, label: "Today's Case Stats" },
  { icon: faBriefcase, label: "Past Cases" },
  { icon: faUserSecret, label: "User Stats" },
  { icon: faVolumeHigh, label: "Sound On/Off" },
] as const;

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Split prologue into pages (each page is an array of paragraphs)
const PROLOGUE_PAGES = [
  [
    'Rain pounded the glass of my office window when there was a knock at the door. "BANG, BANG!"',
    '"What brings you here, Commissioner? Woj bomb?", I chuckled as he entered.',
    "He ignored my quip. \"The Tanking Syndicate stole our signs and hacked the Hall of Records. Wiped athlete identities clean. Now half of Statsland can't remember who their favorite players are anymore. It's chaos.\"",
    '"Looks like you\'re on the brink of an epic collapse, Commish," I responded.',
  ],
  [
    '"Off-the-field issues aside," he said, glancing at my bottle of whiskey. "Your talent is off the charts. Frankly, you know the game better than anyone in my front office."',
    "He dropped a stack of case files on my desk as thick as an NFL playbook. I filpped through the files. I looked at the clock.",
    '"Looks like Statsland\'s running out of time and you\'re all out of timeouts," I said. "Lucky for you comebacks are my calling card."',
  ],
  [
    "How to Play",
    "It's up to you to figure out each day's mystery athlete! Solve the case with the highest score possible.",
    `Start with ${INITIAL_SCORE} points. Each clue deducts a different amount of points. Each incorrect guess is -${INCORRECT_GUESS_PENALTY} point${INCORRECT_GUESS_PENALTY === 1 ? "" : "s"}.`,
    "Cases increase in difficulty from Sunday through Saturday.",
    "Play each day, build up your stats, and share with your friends! Good luck!",
  ],
];

function RulesModal({
  isOpen,
  onClose,
}: RulesModalProps): React.ReactElement | null {
  const [currentPage, setCurrentPage] = useState(0);
  const [displayedChars, setDisplayedChars] = useState(0);

  const currentPageText = PROLOGUE_PAGES[currentPage].join("\n\n");
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === PROLOGUE_PAGES.length - 1;
  const isPageComplete = displayedChars >= currentPageText.length;

  useEffect(() => {
    if (!isOpen) {
      setCurrentPage(0);
      setDisplayedChars(0);
      return;
    }

    if (displayedChars >= currentPageText.length) {
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedChars((prev) => Math.min(prev + 1, currentPageText.length));
    }, 20);

    return () => clearTimeout(timer);
  }, [isOpen, displayedChars, currentPageText.length]);

  const handleNextPage = () => {
    if (!isPageComplete) {
      // Skip to end of current page
      setDisplayedChars(currentPageText.length);
    } else if (isLastPage) {
      onClose();
    } else if (!isLastPage) {
      // Go to next page
      setCurrentPage((prev) => prev + 1);
      setDisplayedChars(0);
    }
  };

  const handlePreviousPage = () => {
    if (!isFirstPage) {
      setCurrentPage((prev) => prev - 1);
      setDisplayedChars(0);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="au-rules-modal-overlay" onClick={onClose}>
      <div
        className="au-rules-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="au-rules-notebook-paper" onClick={handleNextPage}>
          {isLastPage ? (
            <div className="au-case-file-paper">
              <div className="au-rules-prologue-container">
                <div className="au-paperclip"></div>
                <div className="au-fingerprint-smudge"></div>

                <div className="au-case-file-text-container">
                  <p
                    className="au-rules-prologue au-rules-prologue-invisible au-how-to-play"
                    aria-hidden="true"
                  >
                    {currentPageText}
                  </p>
                  <p className="au-rules-prologue au-rules-prologue-visible au-how-to-play">
                    {currentPageText.slice(0, displayedChars)}
                  </p>
                </div>
              </div>
              <div
                className={`au-rules-icons-explanation ${isPageComplete ? "au-rules-icons-explanation--visible" : ""}`}
              >
                {ICON_EXPLANATIONS.map(({ icon, label }) => (
                  <div key={label} className="au-rules-icon-item">
                    <FontAwesomeIcon icon={icon} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="au-rules-prologue-container">
              <p
                className="au-rules-prologue au-rules-prologue-invisible"
                aria-hidden="true"
              >
                {currentPageText}
              </p>
              <p className="au-rules-prologue au-rules-prologue-visible">
                {currentPageText.slice(0, displayedChars)}
              </p>
            </div>
          )}
        </div>
        <div className="au-notebook-footer">
          <button
            className={`au-prologue-nav-button ${isFirstPage ? "au-prologue-nav-button--hidden" : ""}`}
            onClick={handlePreviousPage}
          >
            Previous
          </button>
          <div className="au-page-indicator">
            {currentPage + 1} / {PROLOGUE_PAGES.length}
          </div>
          <button className="au-prologue-nav-button" onClick={handleNextPage}>
            {isPageComplete ? (isLastPage ? "Close" : "Next") : "Skip"}
          </button>
        </div>
      </div>
    </div>
  );
}

export { RulesModal };
