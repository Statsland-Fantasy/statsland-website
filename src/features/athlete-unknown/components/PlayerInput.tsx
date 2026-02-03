import React from "react";

interface PlayerInputProps {
  playerName: string;
  isCompleted: boolean;
  onPlayerNameChange: (name: string) => void;
  onSubmit: () => void;
}

export function PlayerInput({
  playerName,
  isCompleted,
  onPlayerNameChange,
  onSubmit,
}: PlayerInputProps): React.ReactElement {
  return (
    <div className="au-player-input">
      <input
        type="text"
        placeholder="Enter player name..."
        value={playerName}
        disabled={isCompleted}
        onChange={(e) => onPlayerNameChange(e.target.value)}
        enterKeyHint="go"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
            onSubmit();
          }
        }}
      />
    </div>
  );
}
