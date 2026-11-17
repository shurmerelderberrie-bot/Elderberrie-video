import {
  AbsoluteFill,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { HAND_FONT, SERIF_FONT } from "./fonts";
import { BRAND, useLayout } from "./layout";

// A 9:16 Reel announcing the website: phone screen captures of the
// homepage and a product page, framed in a simple phone, with captions
// above it. public/site/home.mp4 and product.mp4 are 30 fps, 780x1688
// (an iPhone-sized 390x844 screen at 2x), made frame by frame while
// scrolling so they stay sharp.
export const SITE_INTRO_FRAMES = 75;
export const SITE_HOME_FRAMES = 255;
export const SITE_PRODUCT_FRAMES = 210;
export const SITE_END_FRAMES = 120;
export const SITE_REEL_FRAMES =
  SITE_INTRO_FRAMES + SITE_HOME_FRAMES + SITE_PRODUCT_FRAMES + SITE_END_FRAMES;

export const siteReelSchema = z.object({
  intro: z.string(),
  homeCaption: z.string(),
  productCaption: z.string(),
  url: z.string(),
  footnote: z.string(),
});

export type SiteReelProps = z.infer<typeof siteReelSchema>;

const fadeInOut = (frame: number, duration: number, inF = 10, outF = 10) =>
  interpolate(frame, [0, inF, duration - outF, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Caption: React.FC<{ text: string; duration: number }> = ({
  text,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        fontFamily: HAND_FONT,
        fontWeight: 700,
        fontSize: 82,
        lineHeight: 1,
        letterSpacing: 2,
        opacity: fadeInOut(frame, duration, 8, 8),
        transform: `translateY(${(1 - rise) * 20}px)`,
      }}
    >
      {text}
    </div>
  );
};

const Phone: React.FC<{ height: number; children: React.ReactNode }> = ({
  height,
  children,
}) => {
  const bezel = 18;
  const screenH = height - bezel * 2;
  const screenW = screenH * (780 / 1688);
  return (
    <div
      style={{
        height,
        width: screenW + bezel * 2,
        padding: bezel,
        borderRadius: 64,
        backgroundColor: "#1d2b4f",
        boxShadow: "0 30px 80px rgba(43, 84, 175, 0.3)",
      }}
    >
      <div
        style={{
          width: screenW,
          height: screenH,
          borderRadius: 48,
          overflow: "hidden",
          backgroundColor: BRAND.paper,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Intro: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { safe } = useLayout();
  const logoIn = spring({ frame, fps, config: { damping: 200 } });
  const textIn = spring({ frame: frame - 15, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill
      style={{
        paddingTop: safe.top,
        paddingBottom: safe.bottom,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        opacity: fadeInOut(frame, SITE_INTRO_FRAMES, 1, 12),
      }}
    >
      <Img
        src={staticFile("brand/logo.png")}
        style={{
          width: 420,
          height: 420,
          opacity: logoIn,
          transform: `scale(${0.85 + 0.15 * logoIn})`,
        }}
      />
      <div
        style={{
          fontFamily: HAND_FONT,
          fontWeight: 700,
          fontSize: 100,
          opacity: textIn,
          transform: `translateY(${(1 - textIn) * 24}px)`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{ url: string; footnote: string }> = ({
  url,
  footnote,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { safe } = useLayout();
  const steps = ["Download", "Print", "Fold", "Give"];
  return (
    <AbsoluteFill
      style={{
        paddingTop: safe.top,
        paddingBottom: safe.bottom,
        justifyContent: "center",
        alignItems: "center",
        gap: 28,
        opacity: fadeInOut(frame, SITE_END_FRAMES, 10, 1),
      }}
    >
      <Img
        src={staticFile("brand/logo.png")}
        style={{ width: 280, height: 280 }}
      />
      <div style={{ display: "flex", gap: 22 }}>
        {steps.map((step, i) => {
          const pop = spring({
            frame: frame - 8 - i * 8,
            fps,
            config: { damping: 14 },
          });
          return (
            <div
              key={step}
              style={{
                fontFamily: HAND_FONT,
                fontWeight: 700,
                fontSize: 64,
                transform: `scale(${Math.max(0, pop)})`,
              }}
            >
              {step}
              {i < steps.length - 1 ? " ·" : ""}
            </div>
          );
        })}
      </div>
      <div
        style={{
          fontFamily: HAND_FONT,
          fontWeight: 700,
          fontSize: 66,
          padding: "16px 60px",
          borderRadius: 80,
          backgroundColor: BRAND.blue,
          color: BRAND.paper,
        }}
      >
        {url}
      </div>
      <div
        style={{ fontFamily: SERIF_FONT, fontStyle: "italic", fontSize: 38 }}
      >
        {footnote}
      </div>
    </AbsoluteFill>
  );
};

export const SiteReel: React.FC<SiteReelProps> = ({
  intro,
  homeCaption,
  productCaption,
  url,
  footnote,
}) => {
  const frame = useCurrentFrame();
  const { height, safe } = useLayout();
  const screenStart = SITE_INTRO_FRAMES;
  const screenEnd = screenStart + SITE_HOME_FRAMES + SITE_PRODUCT_FRAMES;
  const phoneIn = interpolate(
    frame,
    [screenStart - 10, screenStart + 12],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const phoneOut = interpolate(frame, [screenEnd - 12, screenEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const captionTop = safe.top;
  const captionHeight = 130;
  // The phone is artwork, so it may run a little into the lower UI zone
  const phoneTop = captionTop + captionHeight + 20;
  const phoneHeight = height * 0.86 - phoneTop;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 40%, ${BRAND.paper} 0%, ${BRAND.cream} 75%)`,
        color: BRAND.blue,
        textAlign: "center",
      }}
    >
      <Sequence durationInFrames={SITE_INTRO_FRAMES}>
        <Intro text={intro} />
      </Sequence>

      <Sequence from={screenStart} durationInFrames={screenEnd - screenStart}>
        <AbsoluteFill style={{ alignItems: "center" }}>
          <div
            style={{
              position: "absolute",
              top: phoneTop,
              opacity: phoneIn * phoneOut,
              transform: `translateY(${(1 - phoneIn) * 80}px)`,
            }}
          >
            <Phone height={phoneHeight}>
              <Sequence durationInFrames={SITE_HOME_FRAMES} layout="none">
                <OffthreadVideo
                  src={staticFile("site/home.mp4")}
                  muted
                  style={{ width: "100%", height: "100%" }}
                />
              </Sequence>
              <Sequence
                from={SITE_HOME_FRAMES}
                durationInFrames={SITE_PRODUCT_FRAMES}
                layout="none"
              >
                <OffthreadVideo
                  src={staticFile("site/product.mp4")}
                  muted
                  style={{ width: "100%", height: "100%" }}
                />
              </Sequence>
            </Phone>
          </div>
        </AbsoluteFill>
      </Sequence>

      <AbsoluteFill
        style={{
          top: captionTop,
          height: captionHeight,
          bottom: "auto",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Sequence
          from={screenStart}
          durationInFrames={SITE_HOME_FRAMES}
          layout="none"
        >
          <Caption text={homeCaption} duration={SITE_HOME_FRAMES} />
        </Sequence>
        <Sequence
          from={screenStart + SITE_HOME_FRAMES}
          durationInFrames={SITE_PRODUCT_FRAMES}
          layout="none"
        >
          <Caption text={productCaption} duration={SITE_PRODUCT_FRAMES} />
        </Sequence>
      </AbsoluteFill>

      <Sequence from={screenEnd} durationInFrames={SITE_END_FRAMES}>
        <EndCard url={url} footnote={footnote} />
      </Sequence>
    </AbsoluteFill>
  );
};
