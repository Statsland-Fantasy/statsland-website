import React from "react";
import "./UserStatsModal.css";

interface TileTracker {
  bio: number;
  careerStats: number;
  draftInformation: number;
  jerseyNumbers: number;
  personalAchievements: number;
  photo: number;
  playerInformation: number;
  teamsPlayedOn: number;
  yearsActive: number;
}

interface SportStats {
  averageCorrectScore: number;
  currentDailyStreak: number;
  firstTileFlippedTracker: TileTracker;
  highestScore: number;
  lastTileFlippedTracker: TileTracker;
  mostTileFlippedTracker: TileTracker;
  mostCommonFirstTileFlipped: string;
  mostCommonLastTileFlipped: string;
  mostCommonTileFlipped: string;
  leastCommonTileFlipped: string;
  percentageCorrect: number;
  sport: string;
  totalPlays: number;
}

interface UserStats {
  userId: string;
  sports: SportStats[];
  userCreated: string;
}

interface UserStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockUserStats: UserStats = {
  userId: "FirstTestProdUser123",
  sports: [
    {
      averageCorrectScore: 70,
      currentDailyStreak: 3,
      firstTileFlippedTracker: {
        bio: 11,
        careerStats: 17,
        draftInformation: 13,
        jerseyNumbers: 16,
        personalAchievements: 18,
        photo: 19,
        playerInformation: 12,
        teamsPlayedOn: 15,
        yearsActive: 14,
      },
      highestScore: 90,
      lastTileFlippedTracker: {
        bio: 11,
        careerStats: 71,
        draftInformation: 31,
        jerseyNumbers: 61,
        personalAchievements: 81,
        photo: 91,
        playerInformation: 21,
        teamsPlayedOn: 51,
        yearsActive: 41,
      },
      mostTileFlippedTracker: {
        bio: 11,
        careerStats: 71,
        draftInformation: 31,
        jerseyNumbers: 61,
        personalAchievements: 81,
        photo: 91,
        playerInformation: 21,
        teamsPlayedOn: 51,
        yearsActive: 41,
      },
      mostCommonFirstTileFlipped: "playerInformation",
      mostCommonLastTileFlipped: "photo",
      mostCommonTileFlipped: "careerStats",
      leastCommonTileFlipped: "bio",
      percentageCorrect: 0.81,
      sport: "basketball",
      totalPlays: 10,
    },
    {
      averageCorrectScore: 70,
      currentDailyStreak: 5,
      firstTileFlippedTracker: {
        bio: 21,
        careerStats: 27,
        draftInformation: 23,
        jerseyNumbers: 26,
        personalAchievements: 28,
        photo: 29,
        playerInformation: 22,
        teamsPlayedOn: 25,
        yearsActive: 24,
      },
      highestScore: 90,
      lastTileFlippedTracker: {
        bio: 12,
        careerStats: 72,
        draftInformation: 32,
        jerseyNumbers: 62,
        personalAchievements: 82,
        photo: 92,
        playerInformation: 22,
        teamsPlayedOn: 52,
        yearsActive: 42,
      },
      mostTileFlippedTracker: {
        bio: 12,
        careerStats: 72,
        draftInformation: 32,
        jerseyNumbers: 62,
        personalAchievements: 82,
        photo: 92,
        playerInformation: 22,
        teamsPlayedOn: 52,
        yearsActive: 42,
      },
      mostCommonFirstTileFlipped: "playerInformation",
      mostCommonLastTileFlipped: "photo",
      mostCommonTileFlipped: "careerStats",
      leastCommonTileFlipped: "bio",
      percentageCorrect: 0.82,
      sport: "baseball",
      totalPlays: 30,
    },
    {
      averageCorrectScore: 70,
      currentDailyStreak: 7,
      firstTileFlippedTracker: {
        bio: 31,
        careerStats: 37,
        draftInformation: 33,
        jerseyNumbers: 36,
        personalAchievements: 38,
        photo: 39,
        playerInformation: 32,
        teamsPlayedOn: 35,
        yearsActive: 34,
      },
      highestScore: 90,
      lastTileFlippedTracker: {
        bio: 13,
        careerStats: 73,
        draftInformation: 33,
        jerseyNumbers: 63,
        personalAchievements: 83,
        photo: 93,
        playerInformation: 23,
        teamsPlayedOn: 53,
        yearsActive: 43,
      },
      mostTileFlippedTracker: {
        bio: 13,
        careerStats: 73,
        draftInformation: 33,
        jerseyNumbers: 63,
        personalAchievements: 83,
        photo: 93,
        playerInformation: 23,
        teamsPlayedOn: 53,
        yearsActive: 43,
      },
      mostCommonFirstTileFlipped: "playerInformation",
      mostCommonLastTileFlipped: "photo",
      mostCommonTileFlipped: "careerStats",
      leastCommonTileFlipped: "bio",
      percentageCorrect: 0.83,
      sport: "football",
      totalPlays: 30,
    },
  ],
  userCreated: "2025-11-19T07:47:47.242Z",
};

const formatTileName = (tileName: string): string => {
  return tileName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const UserStatsModal: React.FC<UserStatsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const userStats = mockUserStats;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>User Statistics</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="user-info">
            <p>
              <strong>User ID:</strong> {userStats.userId}
            </p>
            <p>
              <strong>Member Since:</strong>{" "}
              {new Date(userStats.userCreated).toLocaleDateString()}
            </p>
          </div>

          {userStats.sports.map((sportStats) => (
            <div key={sportStats.sport} className="sport-section">
              <h3 className="sport-title">
                {sportStats.sport.charAt(0).toUpperCase() +
                  sportStats.sport.slice(1)}
              </h3>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Plays</div>
                  <div className="stat-value">{sportStats.totalPlays}</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Win Rate</div>
                  <div className="stat-value">
                    {(sportStats.percentageCorrect * 100).toFixed(0)}%
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Current Streak</div>
                  <div className="stat-value">
                    {sportStats.currentDailyStreak}
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Highest Score</div>
                  <div className="stat-value">{sportStats.highestScore}</div>
                </div>

                <div className="stat-card">
                  <div className="stat-label">Average Score</div>
                  <div className="stat-value">
                    {sportStats.averageCorrectScore}
                  </div>
                </div>
              </div>

              <div className="tile-stats">
                <h4>Tile Preferences</h4>
                <div className="tile-preferences">
                  <p>
                    <strong>Most Common First Tile:</strong>{" "}
                    {formatTileName(sportStats.mostCommonFirstTileFlipped)}
                  </p>
                  <p>
                    <strong>Most Common Last Tile:</strong>{" "}
                    {formatTileName(sportStats.mostCommonLastTileFlipped)}
                  </p>
                  <p>
                    <strong>Most Flipped Tile:</strong>{" "}
                    {formatTileName(sportStats.mostCommonTileFlipped)}
                  </p>
                  <p>
                    <strong>Least Flipped Tile:</strong>{" "}
                    {formatTileName(sportStats.leastCommonTileFlipped)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserStatsModal;
