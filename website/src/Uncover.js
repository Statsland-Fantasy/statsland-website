import React, { useState } from "react";
import "./Uncover.css";

// Sample JSON data
const playerData = {
  Name: "Jimmy McJamz",
  Bio: "DOB: Nov 3, 2024 & in Arcadia, CA",
  "Player Information": "5'6 & 130lbs & Pitcher",
  "Draft Information": " Drafted 2024",
  "Years Active": " 1999-2023",
  "Teams Played On": "Los Angeles",
  "Jersey Numbers": "14 & 67 & 32",
  "Career Stats": "Hit %: 32 & Catch %: 88",
  "Personal Achievements": "MVP & GOAT & Best Player",
  Photo: [
    "https://via.placeholder.com/150",
    "https://via.placeholder.com/160",
    "https://via.placeholder.com/170",
    "https://via.placeholder.com/180",
    "https://via.placeholder.com/190",
    "https://via.placeholder.com/200",
    "https://via.placeholder.com/210",
    "https://via.placeholder.com/220",
    "https://via.placeholder.com/230",
  ],
};

// HELPER FUNCTION: Approximate string matching (up to 4 letters off)
const getMatchStatus = (input, target) => {
  const normalize = (str) => str.toLowerCase().replace(/\s/g, "");
  const a = normalize(input);
  const b = normalize(target);

  const lev = (s, t) => {
    const dp = Array.from({ length: s.length + 1 }, () =>
      Array(t.length + 1).fill(0)
    );
    for (let i = 0; i <= s.length; i++) dp[i][0] = i;
    for (let j = 0; j <= t.length; j++) dp[0][j] = j;
    for (let i = 1; i <= s.length; i++) {
      for (let j = 1; j <= t.length; j++) {
        dp[i][j] =
          s[i - 1] === t[j - 1]
            ? dp[i - 1][j - 1]
            : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
      }
    }
    return dp[s.length][t.length];
  };

  const distance = lev(a, b);
  if (a === b) return "exact";
  if (distance <= 4) return "close";
  return "wrong";
};

// TODO Helper Function to split up Player Picture into 3x3 grid

const topics = [
  "Bio",
  "Player Information",
  "Draft Information",
  "Years Active",
  "Teams Played On",
  "Jersey Numbers",
  "Career Stats",
  "Personal Achievements",
  "Photo",
];

const Uncover = () => {
  const [playerName, setPlayerName] = useState("");
  const [message, setMessage] = useState("");
  const [flippedTiles, setFlippedTiles] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFlipped, setModalFlipped] = useState(Array(9).fill(false));

  const handleNameSubmit = () => {
    const status = getMatchStatus(playerName, playerData.Name);
    if (status === "exact") {
      setMessage({ text: "You guessed it right!", type: "success" });
    } else if (status === "close") {
      setMessage({
        text: `Correct, you were close! Player's name: ${playerData.Name}`,
        type: "close",
      });
    } else {
      setMessage({ text: `Wrong guess: "${playerName}"`, type: "error" });
    }
  };

  const handleTileClick = (index) => {
    if (topics[index] === "Photo") {
      setModalOpen(true);
      return;
    }
    setFlippedTiles((prev) => prev + 1);
    const tileInner = document.getElementById(`tile-inner-${index}`);
    tileInner.classList.toggle("flipped");
  };

  const handleModalTileClick = (index) => {
    setModalFlipped((prev) => {
      const newFlipped = [...prev];
      newFlipped[index] = !newFlipped[index];
      return newFlipped;
    });
    setFlippedTiles((prev) => prev + 1);
  };

  return (
    <div className="uncover-game">
      {message && (
        <p className={`guess-message ${message.type}`}>{message.text}</p>
      )}

      <div className="player-input">
        <input
          type="text"
          placeholder="Enter player name..."
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button onClick={handleNameSubmit}>Submit</button>
      </div>

      <h3>Tiles Flipped: {flippedTiles}</h3>
      <div className="grid">
        {topics.map((topic, i) => (
          <div className="tile" key={i}>
            <div
              className="tile-inner"
              id={`tile-inner-${i}`}
              onClick={() => handleTileClick(i)}
            >
              <div className="tile-front">{topic}</div>
              <div className="tile-back">
                {topic === "Photo" ? "Click for photos" : playerData[topic]}
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close" onClick={() => setModalOpen(false)}>
              X
            </button>
            <div className="grid">
              {playerData.Photo.map((photoUrl, i) => (
                <div className="tile" key={i}>
                  <div
                    className={`tile-inner ${modalFlipped[i] ? "flipped" : ""}`}
                    onClick={() => handleModalTileClick(i)}
                  >
                    <div className="tile-front">Photo {i + 1}</div>
                    <div className="tile-back">
                      <img src={photoUrl} alt={`Player ${i + 1}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Uncover;
