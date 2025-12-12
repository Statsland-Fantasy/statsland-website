import "./globals.css";

const regionColors = {
  northwest: {
    fill: "rgba(255, 107, 107, 0.1)",
    fillHover: "rgba(255, 107, 107, 0.5)",
  },
  southwest: {
    fill: "rgba(74, 222, 128, 0.1)",
    fillHover: "rgba(74, 222, 128, 0.5)",
  },
  north: {
    fill: "rgba(96, 165, 250, 0.1)",
    fillHover: "rgba(96, 165, 250, 0.5)",
  },
  central: {
    fill: "rgba(251, 191, 36, 0.1)",
    fillHover: "rgba(251, 191, 36, 0.5)",
  },
  east: {
    fill: "rgba(255, 107, 107, 0.1)",
    fillHover: "rgba(255, 107, 107, 0.5)",
  },
};

export default function Hotspot({ data, onSelect }) {
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
        e.target.style.fill = colors.fillHover;
      }}
      onMouseLeave={(e) => {
        e.target.style.fill = colors.fill;
      }}
    />
  );
}
