import { useState, useEffect } from "react";
import { PHOTO_GRID } from "../config";

const DEFAULT_GAP = 3;

interface TileGridValues {
  tileSize: number;
  gap: number;
}

function getComputedCSSPixels(cssVar: string, fallback: number): number {
  if (typeof window === "undefined") {
    return fallback;
  }

  // Create a temporary element to get the resolved CSS variable value
  // (getPropertyValue on custom properties returns the raw expression, not computed pixels)
  const temp = document.createElement("div");
  temp.style.width = `var(${cssVar})`;
  temp.style.position = "absolute";
  temp.style.visibility = "hidden";
  document.body.appendChild(temp);

  const computed = getComputedStyle(temp).width;
  document.body.removeChild(temp);

  const pixels = parseFloat(computed);
  return isNaN(pixels) ? fallback : pixels;
}

function getComputedTileGridValues(): TileGridValues {
  return {
    tileSize: getComputedCSSPixels("--au-tile-size", PHOTO_GRID.DEFAULT_TILE_SIZE),
    gap: getComputedCSSPixels("--au-tile-grid-gap", DEFAULT_GAP),
  };
}

export function useTileSize(): TileGridValues {
  const [values, setValues] = useState(getComputedTileGridValues);

  useEffect(() => {
    const updateValues = () => {
      setValues(getComputedTileGridValues());
    };

    updateValues();
    window.addEventListener("resize", updateValues);
    return () => window.removeEventListener("resize", updateValues);
  }, []);

  return values;
}
