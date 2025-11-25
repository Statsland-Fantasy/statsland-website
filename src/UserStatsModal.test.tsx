import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserStatsModal from "./UserStatsModal";

describe("UserStatsModal", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  test("does not render when isOpen is false", () => {
    render(<UserStatsModal isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByText("User Statistics")).not.toBeInTheDocument();
  });

  test("renders when isOpen is true", () => {
    render(<UserStatsModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText("User Statistics")).toBeInTheDocument();
  });

  test("displays user information", () => {
    render(<UserStatsModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText(/User ID:/)).toBeInTheDocument();
    expect(screen.getByText(/FirstTestProdUser123/)).toBeInTheDocument();
    expect(screen.getByText(/Member Since:/)).toBeInTheDocument();
  });

  test("displays all three sports sections", () => {
    render(<UserStatsModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText("Basketball")).toBeInTheDocument();
    expect(screen.getByText("Baseball")).toBeInTheDocument();
    expect(screen.getByText("Football")).toBeInTheDocument();
  });

  test("displays basketball stats correctly", () => {
    render(<UserStatsModal isOpen={true} onClose={mockOnClose} />);

    // Check for total plays
    const basketballSection = screen.getByText("Basketball").closest(".sport-section");
    expect(basketballSection).toHaveTextContent("10");

    // Check for win rate (81%)
    expect(basketballSection).toHaveTextContent("81%");

    // Check for current streak
    expect(basketballSection).toHaveTextContent("3");

    // Check for highest score
    expect(basketballSection).toHaveTextContent("90");

    // Check for average score
    expect(basketballSection).toHaveTextContent("70");
  });

  test("displays baseball stats correctly", () => {
    render(<UserStatsModal isOpen={true} onClose={mockOnClose} />);

    const baseballSection = screen.getByText("Baseball").closest(".sport-section");
    expect(baseballSection).toHaveTextContent("30");
    expect(baseballSection).toHaveTextContent("82%");
    expect(baseballSection).toHaveTextContent("5");
  });

  test("displays football stats correctly", () => {
    render(<UserStatsModal isOpen={true} onClose={mockOnClose} />);

    const footballSection = screen.getByText("Football").closest(".sport-section");
    expect(footballSection).toHaveTextContent("30");
    expect(footballSection).toHaveTextContent("83%");
    expect(footballSection).toHaveTextContent("7");
  });

  test("displays tile preferences", () => {
    render(<UserStatsModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getAllByText(/Most Common First Tile:/).length).toBe(3);
    expect(screen.getAllByText(/Most Common Last Tile:/).length).toBe(3);
    expect(screen.getAllByText(/Most Flipped Tile:/).length).toBe(3);
    expect(screen.getAllByText(/Least Flipped Tile:/).length).toBe(3);
  });

  test("formats tile names correctly", () => {
    render(<UserStatsModal isOpen={true} onClose={mockOnClose} />);

    // Should convert camelCase to Title Case
    expect(screen.getAllByText(/Player Information/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Career Stats/).length).toBeGreaterThan(0);
  });

  test("closes when close button is clicked", () => {
    render(<UserStatsModal isOpen={true} onClose={mockOnClose} />);

    const closeButton = screen.getByText("×");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("closes when overlay is clicked", () => {
    render(<UserStatsModal isOpen={true} onClose={mockOnClose} />);

    const overlay = screen.getByText("User Statistics").closest(".modal-overlay");
    fireEvent.click(overlay!);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("does not close when modal content is clicked", () => {
    render(<UserStatsModal isOpen={true} onClose={mockOnClose} />);

    const modalContent = screen.getByText("User Statistics").closest(".modal-content");
    fireEvent.click(modalContent!);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("displays stat cards with correct labels", () => {
    render(<UserStatsModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getAllByText("Total Plays").length).toBe(3);
    expect(screen.getAllByText("Win Rate").length).toBe(3);
    expect(screen.getAllByText("Current Streak").length).toBe(3);
    expect(screen.getAllByText("Highest Score").length).toBe(3);
    expect(screen.getAllByText("Average Score").length).toBe(3);
  });
});
