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
import { Phone } from "./SiteReel";

// A 9:16 Reel announcing the website launch:
// hook with cards flying in, the homepage on a phone, a grid of cards,
// a product page with the price, the four steps, and the web address.
// Phone clips come from scripts/capture-site.js (public/site/).
export const LAUNCH_HOOK = 90;
export const LAUNCH_HOME = 255;
export const LAUNCH_GRID = 120;
export const LAUNCH_PRODUCT = 210;
export const LAUNCH_STEPS = 100;
export const LAUNCH_END = 135;
export const LAUNCH_REEL_FRAMES =
  LAUNCH_HOOK +
  LAUNCH_HOME +
  LAUNCH_GRID +
  LAUNCH_PRODUCT +
  LAUNCH_STEPS +
  LAUNCH_END;

export const launchReelSchema = z.object({
  kicker: z.string(),
  headline: z.string(),
  homeCaption: z.string(),
  gridCaption: z.string(),
  gridCards: z
    .array(z.string())
    .describe("Folders in public/ with a photo.webp, e.g. cards/<slug>"),
  productCaption: z.string(),
  steps: z.array(z.string()),
  url: z.string(),
  cta: z.string(),
  signoff: z.string(),
});

export type LaunchReelProps = z.infer<typeof launchReelSchema>;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const fade = (frame: number, duration: number, inF = 10, outF = 10) =>
  interpolate(frame, [0, inF, duration - outF, duration], [0, 1, 1, 0], clamp);

const heading: React.CSSProperties = {
  fontFamily: HAND_FONT,
  fontWeight: 700,
  lineHeight: 1,
  letterSpacing: 2,
  textWrap: "balance",
};

// Cards from the brand folder that drift in around the headline
const HOOK_CARDS = [
  { src: "brand/card-holly-jolly.png", x: -330, y: -520, r: -12, d: 0 },
  { src: "brand/card-today-you-are-one.png", x: 330, y: -470, r: 10, d: 5 },
  { src: "brand/card-mistletoe.png", x: -350, y: 470, r: 8, d: 10 },
  { src: "brand/card-engaged.png", x: 340, y: 520, r: -9, d: 15 },
];

const Hook: React.FC<{ kicker: string; headline: string }> = ({
  kicker,
  headline,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { safe } = useLayout();
  const logoIn = spring({ frame, fps, config: { damping: 200 } });
  const kickerIn = spring({ frame: frame - 6, fps, config: { damping: 200 } });
  const headIn = spring({ frame: frame - 16, fps, config: { damping: 11 } });

  return (
    <AbsoluteFill style={{ opacity: fade(frame, LAUNCH_HOOK, 1, 12) }}>
      {HOOK_CARDS.map((card) => {
        const s = spring({
          frame: frame - card.d,
          fps,
          config: { damping: 15 },
        });
        const drift = interpolate(frame, [0, LAUNCH_HOOK], [0, 18]);
        return (
          <Img
            key={card.src}
            src={staticFile(card.src)}
            style={{
              position: "absolute",
              left: "50%",
              top: "48%",
              width: 300,
              marginLeft: -150,
              marginTop: -210,
              borderRadius: 10,
              boxShadow: "0 18px 40px rgba(43, 84, 175, 0.2)",
              opacity: s,
              transform: `translate(${card.x * s}px, ${card.y * s + drift}px) rotate(${card.r * s}deg) scale(${0.6 + 0.4 * s})`,
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          paddingTop: safe.top,
          paddingBottom: safe.bottom,
          paddingLeft: safe.side,
          paddingRight: safe.side,
          justifyContent: "center",
          alignItems: "center",
          gap: 18,
        }}
      >
        <Img
          src={staticFile("brand/logo.png")}
          style={{
            width: 240,
            height: 240,
            opacity: logoIn,
            transform: `scale(${0.8 + 0.2 * logoIn})`,
          }}
        />
        <div
          style={{
            fontFamily: SERIF_FONT,
            fontStyle: "italic",
            fontSize: 46,
            opacity: kickerIn,
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            ...heading,
            fontSize: 132,
            transform: `scale(${Math.max(0, headIn)})`,
          }}
        >
          {headline}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

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
        ...heading,
        fontSize: 84,
        opacity: fade(frame, duration, 8, 8),
        transform: `translateY(${(1 - rise) * 24}px)`,
      }}
    >
      {text}
    </div>
  );
};

const Grid: React.FC<{ cards: string[]; width: number; height: number }> = ({
  cards,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cols = 3;
  const rows = Math.ceil(cards.length / cols);
  const gap = 18;
  const cellW = (width - gap * (cols - 1)) / cols;
  const cellH = Math.min(cellW * 1.25, (height - gap * (rows - 1)) / rows);
  const out = interpolate(
    frame,
    [LAUNCH_GRID - 10, LAUNCH_GRID],
    [1, 0],
    clamp,
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${cellW}px)`,
        gap,
        opacity: out,
      }}
    >
      {cards.map((folder, i) => {
        const s = spring({
          frame: frame - i * 4,
          fps,
          config: { damping: 13 },
        });
        return (
          <div
            key={folder}
            style={{
              width: cellW,
              height: cellH,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 12px 30px rgba(43, 84, 175, 0.18)",
              opacity: Math.min(1, s * 1.5),
              transform: `scale(${Math.max(0, s)})`,
            }}
          >
            <Img
              src={staticFile(`${folder}/photo.webp`)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        );
      })}
    </div>
  );
};

const Steps: React.FC<{ steps: string[] }> = ({ steps }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { safe } = useLayout();
  return (
    <AbsoluteFill
      style={{
        paddingTop: safe.top,
        paddingBottom: safe.bottom,
        justifyContent: "center",
        alignItems: "center",
        opacity: fade(frame, LAUNCH_STEPS, 6, 10),
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 6,
        }}
      >
        {steps.map((step, i) => {
          const s = spring({
            frame: frame - i * 12,
            fps,
            config: { damping: 12 },
          });
          return (
            <div
              key={step}
              style={{
                ...heading,
                fontSize: 150,
                display: "flex",
                alignItems: "center",
                gap: 30,
                opacity: Math.min(1, s * 1.5),
                transform: `translateX(${(1 - s) * (i % 2 ? 160 : -160)}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: SERIF_FONT,
                  fontSize: 50,
                  width: 84,
                  height: 84,
                  borderRadius: 42,
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: BRAND.blue,
                  color: BRAND.paper,
                }}
              >
                {i + 1}
              </span>
              {step}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const End: React.FC<{ url: string; cta: string; signoff: string }> = ({
  url,
  cta,
  signoff,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { safe } = useLayout();
  const urlIn = spring({ frame: frame - 10, fps, config: { damping: 11 } });
  const restIn = spring({ frame: frame - 28, fps, config: { damping: 200 } });
  const pulse = 1 + 0.03 * Math.sin(Math.max(0, frame - 40) / 6);
  return (
    <AbsoluteFill
      style={{
        paddingTop: safe.top,
        paddingBottom: safe.bottom,
        justifyContent: "center",
        alignItems: "center",
        gap: 30,
        opacity: fade(frame, LAUNCH_END, 10, 1),
      }}
    >
      <Img
        src={staticFile("brand/logo.png")}
        style={{ width: 300, height: 300 }}
      />
      <div
        style={{
          fontFamily: HAND_FONT,
          fontWeight: 700,
          fontSize: 76,
          padding: "18px 64px",
          borderRadius: 90,
          backgroundColor: BRAND.blue,
          color: BRAND.paper,
          transform: `scale(${Math.max(0, urlIn) * pulse})`,
        }}
      >
        {url}
      </div>
      <div style={{ opacity: restIn, textAlign: "center" }}>
        <div style={{ ...heading, fontSize: 70 }}>{cta}</div>
        <div
          style={{
            fontFamily: SERIF_FONT,
            fontStyle: "italic",
            fontSize: 42,
            marginTop: 18,
          }}
        >
          {signoff}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const LaunchReel: React.FC<LaunchReelProps> = (props) => {
  const frame = useCurrentFrame();
  const { height, safe } = useLayout();

  const homeFrom = LAUNCH_HOOK;
  const gridFrom = homeFrom + LAUNCH_HOME;
  const productFrom = gridFrom + LAUNCH_GRID;
  const stepsFrom = productFrom + LAUNCH_PRODUCT;
  const endFrom = stepsFrom + LAUNCH_STEPS;

  const captionHeight = 140;
  const contentTop = safe.top + captionHeight + 20;
  // The phone is artwork, so it may run a little into the lower UI zone
  const phoneHeight = height * 0.86 - contentTop;

  // Phone slides in for the homepage, out for the grid, back for the product
  const phoneShown = (from: number, dur: number) =>
    interpolate(
      frame,
      [from - 10, from + 12, from + dur - 12, from + dur],
      [0, 1, 1, 0],
      clamp,
    );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 40%, ${BRAND.paper} 0%, ${BRAND.cream} 75%)`,
        color: BRAND.blue,
        textAlign: "center",
      }}
    >
      <Sequence durationInFrames={LAUNCH_HOOK}>
        <Hook kicker={props.kicker} headline={props.headline} />
      </Sequence>

      {[
        { from: homeFrom, dur: LAUNCH_HOME, clip: "site/home.mp4" },
        { from: productFrom, dur: LAUNCH_PRODUCT, clip: "site/product.mp4" },
      ].map(({ from, dur, clip }) => {
        const shown = phoneShown(from, dur);
        return (
          <Sequence key={clip} from={from} durationInFrames={dur}>
            <AbsoluteFill style={{ alignItems: "center" }}>
              <div
                style={{
                  position: "absolute",
                  top: contentTop,
                  opacity: shown,
                  transform: `translateY(${(1 - shown) * 90}px)`,
                }}
              >
                <Phone height={phoneHeight}>
                  <OffthreadVideo
                    src={staticFile(clip)}
                    muted
                    style={{ width: "100%", height: "100%" }}
                  />
                </Phone>
              </div>
            </AbsoluteFill>
          </Sequence>
        );
      })}

      <Sequence from={gridFrom} durationInFrames={LAUNCH_GRID}>
        <AbsoluteFill style={{ alignItems: "center" }}>
          <div style={{ position: "absolute", top: contentTop }}>
            <Grid
              cards={props.gridCards}
              width={safe.width}
              height={height * 0.86 - contentTop}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      <AbsoluteFill
        style={{
          top: safe.top,
          height: captionHeight,
          bottom: "auto",
          paddingLeft: safe.side,
          paddingRight: safe.side,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {[
          { from: homeFrom, dur: LAUNCH_HOME, text: props.homeCaption },
          { from: gridFrom, dur: LAUNCH_GRID, text: props.gridCaption },
          {
            from: productFrom,
            dur: LAUNCH_PRODUCT,
            text: props.productCaption,
          },
        ].map(({ from, dur, text }) => (
          <Sequence key={text} from={from} durationInFrames={dur} layout="none">
            <Caption text={text} duration={dur} />
          </Sequence>
        ))}
      </AbsoluteFill>

      <Sequence from={stepsFrom} durationInFrames={LAUNCH_STEPS}>
        <Steps steps={props.steps} />
      </Sequence>

      <Sequence from={endFrom} durationInFrames={LAUNCH_END}>
        <End url={props.url} cta={props.cta} signoff={props.signoff} />
      </Sequence>
    </AbsoluteFill>
  );
};
