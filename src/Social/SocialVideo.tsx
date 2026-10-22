import { zColor } from "@remotion/zod-types";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const socialVideoSchema = z.object({
  headline: z.string(),
  subline: z.string(),
  cta: z.string(),
  backgroundColor: zColor(),
  accentColor: zColor(),
  textColor: zColor(),
});

export type SocialVideoProps = z.infer<typeof socialVideoSchema>;

// Meta overlays its own UI (captions, buttons, profile) on top of videos.
// Keep text inside these margins so nothing gets covered.
const getSafeZone = (width: number, height: number) => {
  const isVertical = height / width > 1.6;
  return isVertical
    ? // Reels / Stories: keep 14% top, 35% bottom and 6% sides clear
      { top: 0.14, bottom: 0.35, side: 0.06 }
    : { top: 0.08, bottom: 0.08, side: 0.08 };
};

export const SocialVideo: React.FC<SocialVideoProps> = ({
  headline,
  subline,
  cta,
  backgroundColor,
  accentColor,
  textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const safe = getSafeZone(width, height);

  // Scale type off the shorter side so every format looks consistent
  const unit = Math.min(width, height) / 100;

  const headlineIn = spring({ frame, fps, config: { damping: 200 } });
  const sublineIn = spring({ frame: frame - 15, fps, config: { damping: 200 } });
  const ctaIn = spring({ frame: frame - 30, fps, config: { damping: 12 } });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${backgroundColor} 0%, ${accentColor} 140%)`,
      }}
    >
      <AbsoluteFill
        style={{
          paddingTop: height * safe.top,
          paddingBottom: height * safe.bottom,
          paddingLeft: width * safe.side,
          paddingRight: width * safe.side,
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: unit * 5,
          fontFamily: "Helvetica, Arial, sans-serif",
          color: textColor,
          opacity: fadeOut,
        }}
      >
        <div
          style={{
            fontSize: unit * 11,
            fontWeight: "bold",
            lineHeight: 1.05,
            opacity: headlineIn,
            transform: `translateY(${(1 - headlineIn) * unit * 8}px)`,
          }}
        >
          {headline}
        </div>
        <div
          style={{
            fontSize: unit * 5,
            lineHeight: 1.3,
            opacity: sublineIn,
            transform: `translateY(${(1 - sublineIn) * unit * 6}px)`,
          }}
        >
          {subline}
        </div>
        <div
          style={{
            marginTop: unit * 3,
            fontSize: unit * 4.5,
            fontWeight: "bold",
            padding: `${unit * 2.5}px ${unit * 6}px`,
            borderRadius: unit * 10,
            backgroundColor: textColor,
            color: backgroundColor,
            transform: `scale(${ctaIn})`,
          }}
        >
          {cta}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
