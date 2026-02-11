import type { Region } from "./hotspotData";

interface InfoPanelProps {
  region: Region | null;
  onClose: () => void;
}

export function InfoPanel({
  region,
  onClose,
}: InfoPanelProps): React.ReactElement {
  console.log("REGION INFO", region);
  return (
    <div className={`info-panel ${region ? "open" : ""}`}>
      {region && (
        <>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
          <h2 style={{ color: "black" }}>{region.name}</h2>
          <p style={{ color: "blue" }}>{region.description}</p>
        </>
      )}
    </div>
  );
}
