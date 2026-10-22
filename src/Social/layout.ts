import { useVideoConfig } from "remotion";

export const BRAND = {
  blue: "#2B54AF",
  cream: "#F6EFE3",
  paper: "#FBF8F1",
};

// Meta overlays its own UI (captions, buttons, profile) on top of videos.
// Text and logos stay inside the safe box so nothing gets covered.
export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const isVertical = height / width > 1.6;
  const safe = isVertical
    ? // Reels / Stories: keep 14% top, 35% bottom and 6% sides clear
      { top: 0.14, bottom: 0.35, side: 0.06 }
    : { top: 0.07, bottom: 0.07, side: 0.07 };

  return {
    width,
    height,
    isVertical,
    // Scale everything off the shorter side so formats look consistent
    unit: Math.min(width, height) / 100,
    safe: {
      top: height * safe.top,
      bottom: height * safe.bottom,
      side: width * safe.side,
      width: width * (1 - safe.side * 2),
      height: height * (1 - safe.top - safe.bottom),
    },
  };
};
