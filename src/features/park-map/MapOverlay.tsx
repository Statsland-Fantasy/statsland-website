import { hotspots, type Region } from "./hotspotData";
import { Hotspot } from "./Hotspot";

interface MapOverlayProps {
  offset: { x: number; y: number };
  scale: number;
  onSelect: (region: Region) => void;
}

export function MapOverlay({ offset, scale, onSelect }: MapOverlayProps) {
  return (
    <svg
      className="map-overlay"
      viewBox="0 0 1703 1317"
      preserveAspectRatio="xMidYMid meet"
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
        transformOrigin: "0 0",
      }}
    >
      {hotspots.map((h) => (
        <Hotspot key={h.id} data={h} onSelect={onSelect} />
      ))}
    </svg>
  );
}
