import { useRef, useState } from "react";
import MapOverlay from "./MapOverlay";
import InfoPanel from "./InfoPanel";
import "./globals.css";

export default function MapContainer({ onExit }) {
  const containerRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState(null);

  const onMouseDown = (e) => {
    setDragging(true);
    setStartPos({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const onMouseMove = (e) => {
    if (!dragging) return;
    setOffset({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  };

  const onMouseUp = () => setDragging(false);

  return (
    <div
      ref={containerRef}
      className="map-container"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {onExit && (
        <button
          className="exit-map-btn"
          onClick={(e) => {
            e.stopPropagation();
            onExit();
          }}
        >
          ← Back to Home
        </button>
      )}

      <img
        src="/defunctland-map.png"
        alt="Map"
        className="map-image"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
        draggable={false}
      />

      <MapOverlay offset={offset} onSelect={(region) => setSelected(region)} />

      <InfoPanel region={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
