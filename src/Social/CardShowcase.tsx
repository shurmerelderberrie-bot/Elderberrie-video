import {
  AbsoluteFill,
  Img,
  interpolate,
  Series,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { HAND_FONT, SERIF_FONT } from "./fonts";
import { BRAND, useLayout } from "./layout";

export const INTRO_FRAMES = 90;
export const CARD_FRAMES = 75;
export const STEPS_FRAMES = 135;
export const OUTRO_FRAMES = 120;

export const cardShowcaseSchema = z.object({
  tagline: z.string(),
  cards: z.array(
    z.object({
      image: z.string().describe("File in public/, e.g. brand/card.png"),
      label: z.string(),
    }),
  ),
  stepsTitle: z.string(),
  steps: z.array(z.object({ title: z.string(), text: z.string() })),
  stepsFooter: z.string(),
  outroTitle: z.string(),
  shop: z.string(),
  instagram: z.string(),
  cta: z.string(),
});

export type CardShowcaseProps = z.infer<typeof cardShowcaseSchema>;

export const getShowcaseDuration = (props: CardShowcaseProps) =>
  INTRO_FRAMES + props.cards.length * CARD_FRAMES + STEPS_FRAMES + OUTRO_FRAMES;

// Fades a scene in over its first frames and out over its last
const useSceneFade = (inFrames = 10, outFrames = 10) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(
    frame,
    [0, inFrames, durationInFrames - outFrames, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
};

const SafeBox: React.FC<{
  children: React.ReactNode;
  gap?: number;
  style?: React.CSSProperties;
}> = ({ children, gap = 0, style }) => {
  const { safe } = useLayout();
  return (
    <AbsoluteFill
      style={{
        paddingTop: safe.top,
        paddingBottom: safe.bottom,
        paddingLeft: safe.side,
        paddingRight: safe.side,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: BRAND.blue,
        gap,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Intro: React.FC<{ tagline: string }> = ({ tagline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { unit, safe } = useLayout();
  const fade = useSceneFade(1, 12);
  const logoIn = spring({ frame, fps, config: { damping: 200 } });
  const taglineIn = spring({
    frame: frame - 20,
    fps,
    config: { damping: 200 },
  });
  const logoSize = Math.min(safe.width, safe.height * 0.75);

  return (
    <SafeBox gap={unit * 2} style={{ opacity: fade }}>
      <Img
        src={staticFile("brand/logo.png")}
        style={{
          width: logoSize,
          height: logoSize,
          opacity: logoIn,
          transform: `scale(${0.85 + 0.15 * logoIn})`,
        }}
      />
      <div
        style={{
          fontFamily: SERIF_FONT,
          fontStyle: "italic",
          fontSize: unit * 5,
          marginTop: -logoSize * 0.08,
          opacity: taglineIn,
          transform: `translateY(${(1 - taglineIn) * unit * 3}px)`,
        }}
      >
        {tagline}
      </div>
    </SafeBox>
  );
};

const CardScene: React.FC<{ image: string; label: string }> = ({
  image,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { unit, width, height, safe, isVertical } = useLayout();

  const enter = spring({ frame, fps, config: { damping: 18, mass: 0.8 } });
  const exit = interpolate(
    frame,
    [durationInFrames - 14, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const labelIn = spring({ frame: frame - 8, fps, config: { damping: 200 } });

  // The card is artwork, not text, so on Reels it may reach a little lower
  // than the text safe zone.
  const labelSpace = unit * 20;
  const availableHeight = isVertical
    ? height * 0.6 - labelSpace
    : safe.height - labelSpace;
  const cardHeight = Math.min(availableHeight, (safe.width * 0.9) / 0.705);
  const cardWidth = cardHeight * 0.705;

  const x = (1 - enter) * width * 0.8 - exit * width * 0.8;
  const rotate = (1 - enter) * 8 - exit * 8 - 2 + Math.sin(frame / 20) * 0.6;

  return (
    <AbsoluteFill
      style={{
        paddingTop: safe.top,
        paddingLeft: safe.side,
        paddingRight: safe.side,
        alignItems: "center",
        justifyContent: isVertical ? "flex-start" : "center",
        paddingBottom: isVertical ? 0 : safe.bottom,
      }}
    >
      <div
        style={{
          height: labelSpace,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: HAND_FONT,
          fontWeight: 700,
          fontSize: unit * 8.5,
          lineHeight: 1,
          color: BRAND.blue,
          letterSpacing: unit * 0.3,
          opacity: labelIn * (1 - exit),
          transform: `translateY(${(1 - labelIn) * -unit * 3}px)`,
        }}
      >
        {label}
      </div>
      <Img
        src={staticFile(image)}
        style={{
          width: cardWidth,
          height: cardHeight,
          borderRadius: unit * 0.6,
          boxShadow: `0 ${unit * 2}px ${unit * 5}px rgba(43, 84, 175, 0.25)`,
          transform: `translateX(${x}px) rotate(${rotate}deg)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Steps: React.FC<{
  title: string;
  steps: CardShowcaseProps["steps"];
  footer: string;
}> = ({ title, steps, footer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { unit } = useLayout();
  const fade = useSceneFade(10, 12);
  const titleIn = spring({ frame, fps, config: { damping: 200 } });
  const footerIn = spring({
    frame: frame - 20 - steps.length * 14,
    fps,
    config: { damping: 200 },
  });

  return (
    <SafeBox gap={unit * 4} style={{ opacity: fade }}>
      <div
        style={{
          fontFamily: HAND_FONT,
          fontWeight: 700,
          fontSize: unit * 14,
          lineHeight: 1,
          opacity: titleIn,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: unit * 3,
        }}
      >
        {steps.map((step, i) => {
          const stepIn = spring({
            frame: frame - 15 - i * 14,
            fps,
            config: { damping: 14 },
          });
          return (
            <div
              key={step.title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: unit * 3,
                textAlign: "left",
                opacity: Math.min(1, stepIn),
                transform: `scale(${0.8 + 0.2 * stepIn})`,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: unit * 10,
                  height: unit * 10,
                  borderRadius: "50%",
                  border: `${unit * 0.4}px solid ${BRAND.blue}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: HAND_FONT,
                  fontWeight: 700,
                  fontSize: unit * 7,
                }}
              >
                {i + 1}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: HAND_FONT,
                    fontWeight: 700,
                    fontSize: unit * 8,
                    lineHeight: 1,
                  }}
                >
                  {step.title}
                </div>
                <div
                  style={{
                    fontFamily: SERIF_FONT,
                    fontSize: unit * 3.2,
                    lineHeight: 1.3,
                  }}
                >
                  {step.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          fontFamily: SERIF_FONT,
          fontStyle: "italic",
          fontSize: unit * 4.5,
          opacity: footerIn,
        }}
      >
        {footer}
      </div>
    </SafeBox>
  );
};

const Outro: React.FC<{
  title: string;
  shop: string;
  instagram: string;
  cta: string;
}> = ({ title, shop, instagram, cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { unit, safe } = useLayout();
  const fade = useSceneFade(10, 1);
  const logoIn = spring({ frame, fps, config: { damping: 200 } });
  const textIn = spring({ frame: frame - 12, fps, config: { damping: 200 } });
  const ctaIn = spring({ frame: frame - 28, fps, config: { damping: 12 } });
  const logoSize = Math.min(safe.width * 0.6, safe.height * 0.42);

  return (
    <SafeBox gap={unit * 2.5} style={{ opacity: fade }}>
      <Img
        src={staticFile("brand/logo.png")}
        style={{
          width: logoSize,
          height: logoSize,
          opacity: logoIn,
          transform: `scale(${0.9 + 0.1 * logoIn})`,
        }}
      />
      <div style={{ opacity: textIn }}>
        <div
          style={{
            fontFamily: HAND_FONT,
            fontWeight: 700,
            fontSize: unit * 9,
            lineHeight: 1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: SERIF_FONT,
            fontSize: unit * 4.5,
            marginTop: unit * 1.5,
          }}
        >
          {shop}
        </div>
        <div
          style={{
            fontFamily: SERIF_FONT,
            fontStyle: "italic",
            fontSize: unit * 4,
            marginTop: unit * 0.5,
          }}
        >
          {instagram}
        </div>
      </div>
      <div
        style={{
          marginTop: unit * 1.5,
          fontFamily: HAND_FONT,
          fontWeight: 700,
          fontSize: unit * 7,
          lineHeight: 1,
          padding: `${unit * 1.8}px ${unit * 7}px`,
          borderRadius: unit * 10,
          backgroundColor: BRAND.blue,
          color: BRAND.paper,
          transform: `scale(${Math.max(0, ctaIn)})`,
        }}
      >
        {cta}
      </div>
    </SafeBox>
  );
};

export const CardShowcase: React.FC<CardShowcaseProps> = (props) => {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 40%, ${BRAND.paper} 0%, ${BRAND.cream} 75%)`,
      }}
    >
      <Series>
        <Series.Sequence durationInFrames={INTRO_FRAMES}>
          <Intro tagline={props.tagline} />
        </Series.Sequence>
        {props.cards.map((card) => (
          <Series.Sequence key={card.image} durationInFrames={CARD_FRAMES}>
            <CardScene image={card.image} label={card.label} />
          </Series.Sequence>
        ))}
        <Series.Sequence durationInFrames={STEPS_FRAMES}>
          <Steps
            title={props.stepsTitle}
            steps={props.steps}
            footer={props.stepsFooter}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={OUTRO_FRAMES}>
          <Outro
            title={props.outroTitle}
            shop={props.shop}
            instagram={props.instagram}
            cta={props.cta}
          />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
