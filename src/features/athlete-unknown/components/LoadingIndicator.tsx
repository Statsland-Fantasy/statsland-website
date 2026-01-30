import React, { useState, useEffect } from "react";
import magnifyingGlassWhite from "../assets/magnifying-glass.svg";
import magnifyingGlassBlack from "../assets/magnifying-glass-black.svg";

interface LoadingIndicatorProps {
  text?: string;
  color?: string;
}

export function LoadingIndicator({
  text = "Loading...",
  color,
}: LoadingIndicatorProps): React.ReactElement {
  const [showText, setShowText] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  // Delay before showing text
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowText(true);
    }, 2000); // wait 2s before showing Loading text
    return () => clearTimeout(timeout);
  }, []);

  // Typewriter effect (only runs after showText is true)
  useEffect(() => {
    if (showText && displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, 90);
      return () => clearTimeout(timeout);
    }
  }, [showText, displayedText, text]);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 750);
    return () => clearInterval(interval);
  }, []);

  // Reset when text prop changes
  useEffect(() => {
    setDisplayedText("");
    setShowText(false);
    const timeout = setTimeout(() => setShowText(true), 300);
    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <div className="au-loading-indicator">
      <img
        src={color === "white" ? magnifyingGlassWhite : magnifyingGlassBlack}
        alt="Loading"
        className="au-loading-magnifying-glass"
      />
      <span className="au-loading-text-container">
        <span className="au-loading-text-placeholder">{text}|</span>
        {showText && (
          <span
            className="au-loading-text"
            style={color ? { color } : undefined}
          >
            {displayedText}
            <span
              className={`au-loading-cursor ${showCursor ? "au-loading-cursor--visible" : ""}`}
              style={color ? { color } : undefined}
            >
              |
            </span>
          </span>
        )}
      </span>
    </div>
  );
}
