import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodayStatsModal from "./TodayStatsModal";

describe("TodayStatsModal", () => {
  const mockOnClose = jest.fn();

  const mockRoundStats = {
    playDate: "2025-11-19",
    sport: "baseball",
    name: "David Eckstein",
    totalPlays: 100,
    percentageCorrect: 81,
    averageScore: 55,
    averageCorrectScore: 88,
    highestScore: 97,
    mostCommonFirstTileFlipped: "playerInformation",
    mostCommonLastTileFlipped: "photo",
    mostCommonTileFlipped: "teamsPlayedOn",
    leastCommonTileFlipped: "bio",
    mostFlippedTracker: {
      bio: 11,
      careerStats: 11,
      draftInformation: 11,
      jerseyNumbers: 11,
      personalAchievements: 11,
      photo: 11,
      playerInformation: 11,
      teamsPlayedOn: 11,
      yearsActive: 11,
    },
    firstFlippedTracker: {
      bio: 12,
      careerStats: 12,
      draftInformation: 12,
      jerseyNumbers: 12,
      personalAchievements: 12,
      photo: 12,
      playerInformation: 12,
      teamsPlayedOn: 12,
      yearsActive: 12,
    },
    lastFlippedTracker: {
      bio: 13,
      careerStats: 13,
      draftInformation: 13,
      jerseyNumbers: 13,
      personalAchievements: 13,
      photo: 13,
      playerInformation: 13,
      teamsPlayedOn: 13,
      yearsActive: 13,
    },
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  test("does not render when isOpen is false", () => {
    render(
      <TodayStatsModal
        isOpen={false}
        onClose={mockOnClose}
        roundStats={mockRoundStats}
      />
    );
    expect(screen.queryByText("Today's Stats")).not.toBeInTheDocument();
  });

  test("renders when isOpen is true", () => {
    render(
      <TodayStatsModal
        isOpen={true}
        onClose={mockOnClose}
        roundStats={mockRoundStats}
      />
    );
    expect(screen.getByText("Today's Baseball Stats")).toBeInTheDocument();
  });

  test("displays message when no round stats provided", () => {
    render(
      <TodayStatsModal isOpen={true} onClose={mockOnClose} roundStats={null} />
    );
    expect(screen.getByText("Today's Stats")).toBeInTheDocument();
    expect(
      screen.getByText("Complete today's game to see your results here.")
    ).toBeInTheDocument();
  });

  test("displays round stats correctly", () => {
    render(
      <TodayStatsModal
        isOpen={true}
        onClose={mockOnClose}
        roundStats={mockRoundStats}
      />
    );

    expect(screen.getByText("100")).toBeInTheDocument(); // totalPlays
    expect(screen.getByText("55")).toBeInTheDocument(); // averageScore
    expect(screen.getByText("81%")).toBeInTheDocument(); // percentageCorrect
    expect(screen.getByText("97")).toBeInTheDocument(); // highestScore
    expect(screen.getByText("88")).toBeInTheDocument(); // averageCorrectScore
  });

  test("displays tile statistics", () => {
    render(
      <TodayStatsModal
        isOpen={true}
        onClose={mockOnClose}
        roundStats={mockRoundStats}
      />
    );

    expect(screen.getByText(/Most Common First Tile:/)).toBeInTheDocument();
    expect(screen.getByText(/Player Information/)).toBeInTheDocument();
    expect(screen.getByText(/Most Common Last Tile:/)).toBeInTheDocument();
    expect(screen.getByText(/Photo/)).toBeInTheDocument();
    expect(screen.getByText(/Most Flipped Tile:/)).toBeInTheDocument();
    expect(screen.getByText(/Teams Played On/)).toBeInTheDocument();
    expect(screen.getByText(/Least Flipped Tile:/)).toBeInTheDocument();
    expect(screen.getByText(/Bio/)).toBeInTheDocument();
  });

  test("displays mystery player name", () => {
    render(
      <TodayStatsModal
        isOpen={true}
        onClose={mockOnClose}
        roundStats={mockRoundStats}
      />
    );

    expect(screen.getByText("Today's Mystery Player")).toBeInTheDocument();
    expect(screen.getByText("David Eckstein")).toBeInTheDocument();
  });

  test("closes when close button is clicked", () => {
    render(
      <TodayStatsModal
        isOpen={true}
        onClose={mockOnClose}
        roundStats={mockRoundStats}
      />
    );

    const closeButton = screen.getByText("×");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("closes when overlay is clicked", () => {
    render(
      <TodayStatsModal
        isOpen={true}
        onClose={mockOnClose}
        roundStats={mockRoundStats}
      />
    );

    const overlay = screen
      .getByText("Today's Baseball Stats")
      .closest(".today-stats-modal-overlay");
    fireEvent.click(overlay!);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("does not close when modal content is clicked", () => {
    render(
      <TodayStatsModal
        isOpen={true}
        onClose={mockOnClose}
        roundStats={mockRoundStats}
      />
    );

    const modalContent = screen
      .getByText("Today's Baseball Stats")
      .closest(".today-stats-modal-content");
    fireEvent.click(modalContent!);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("formats sport name correctly", () => {
    const footballStats = { ...mockRoundStats, sport: "football" };
    render(
      <TodayStatsModal
        isOpen={true}
        onClose={mockOnClose}
        roundStats={footballStats}
      />
    );

    expect(screen.getByText("Today's Football Stats")).toBeInTheDocument();
  });
});
