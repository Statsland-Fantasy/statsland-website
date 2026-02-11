import type { Region } from "./hotspotData";
import "../../global.css";

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const mobileOpacity = isMobile ? 0.3 : 0.1;

const regionColors: Record<string, { fill: string; fillHover: string }> = {
  northwest: {
    fill: `rgba(255, 107, 107, ${mobileOpacity})`,
    fillHover: "rgba(255, 107, 107, 0.5)",
  },
  southwest: {
    fill: `rgba(74, 222, 128, ${mobileOpacity})`,
    fillHover: "rgba(74, 222, 128, 0.5)",
  },
  north: {
    fill: `rgba(96, 165, 250, ${mobileOpacity})`,
    fillHover: "rgba(96, 165, 250, 0.5)",
  },
  central: {
    fill: `rgba(251, 191, 36, ${mobileOpacity})`,
    fillHover: "rgba(251, 191, 36, 0.5)",
  },
  east: {
    fill: `rgba(168, 85, 247, ${mobileOpacity})`,
    fillHover: "rgba(168, 85, 247, 0.5)",
  },
};

interface HotspotProps {
  data: Region;
  onSelect: (region: Region) => void;
}

export function Hotspot({ data, onSelect }: HotspotProps): React.ReactElement {
  const colors = regionColors[data.id] || regionColors.americas;

  return (
    <polygon
      className="region"
      points={data.points}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(data);
      }}
      style={{
        fill: colors.fill,
        stroke: "none",
      }}
      onMouseEnter={(e) => {
        (e.target as SVGPolygonElement).style.fill = colors.fillHover;
      }}
      onMouseLeave={(e) => {
        (e.target as SVGPolygonElement).style.fill = colors.fill;
      }}
    />
  );
}
