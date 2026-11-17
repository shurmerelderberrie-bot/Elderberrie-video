import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { HAND_FONT, SERIF_FONT } from "./fonts";
import { BRAND, useLayout } from "./layout";

// A 9:16 Reel for one card, built from the three photos on its website
// product page: the card in someone's hands, then the flat front turning
// over to show our elderberry on the back, then an end card with the price
// and the web address.
export const CARD_PHOTO_FRAMES = 90;
export const CARD_FLIP_FRAMES = 120;
export const CARD_END_FRAMES = 105;
export const CARD_REEL_FRAMES =
  CARD_PHOTO_FRAMES + CARD_FLIP_FRAMES + CARD_END_FRAMES;

export const cardReelSchema = z.object({
  title: z.string(),
  folder: z
    .string()
    .describe("Folder in public/ holding photo.webp, front.webp and back.webp"),
  price: z.string(),
  url: z.string(),
});

export type CardReelProps = z.infer<typeof cardReelSchema>;

const useFade = (inFrames: number, outFrames: number) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(
    frame,
    [0, inFrames, durationInFrames - outFrames, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
};

const shadow = "0 24px 60px rgba(43, 84, 175, 0.22)";

// Lifestyle photo (4:5) with a gentle push in
const Photo: React.FC<{ src: string; height: number }> = ({ src, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useFade(8, 10);
  const pop = spring({ frame, fps, config: { damping: 200 } });
  const zoom = interpolate(frame, [0, CARD_PHOTO_FRAMES], [1, 1.08]);

  return (
    <div
      style={{
        height,
        width: height * 0.8,
        overflow: "hidden",
        borderRadius: 24,
        boxShadow: shadow,
        opacity: fade,
        transform: `scale(${0.94 + 0.06 * pop})`,
      }}
    >
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
        }}
      />
    </div>
  );
};

// The flat front turns over to show the back, then turns back again
const Flip: React.FC<{ front: string; back: string; height: number }> = ({
  front,
  back,
  height,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useFade(10, 10);
  const over = spring({ frame: frame - 30, fps, config: { damping: 16 } });
  const backAgain = spring({ frame: frame - 78, fps, config: { damping: 16 } });
  const angle = 180 * over - 180 * backAgain;
  const showBack = angle > 90;
  const noteIn = interpolate(frame, [40, 52, 74, 84], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // The flat images are 4:5 with the card on a cream mount
  const width = height * 0.8;

  return (
    <div
      style={{
        height,
        width,
        position: "relative",
        perspective: 2400,
        opacity: fade,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `rotateY(${angle}deg)`,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: shadow,
          backgroundColor: BRAND.paper,
        }}
      >
        <Img
          src={showBack ? back : front}
          style={{
            width: "100%",
            height: "100%",
            objectFit: showBack ? "contain" : "cover",
            // Undo the mirror on the back face
            transform: showBack ? "scaleX(-1)" : undefined,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: -90,
          fontFamily: SERIF_FONT,
          fontStyle: "italic",
          fontSize: 40,
          opacity: noteIn,
        }}
      >
        Our little elderberry on the back
      </div>
    </div>
  );
};

const EndCard: React.FC<{ price: string; url: string }> = ({ price, url }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useFade(10, 1);
  const steps = ["Download", "Print", "Fold", "Give"];
  const priceIn = spring({ frame: frame - 40, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 26,
        opacity: fade,
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
          fontFamily: SERIF_FONT,
          fontStyle: "italic",
          fontSize: 42,
          opacity: priceIn,
        }}
      >
        {price} · instant download
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: HAND_FONT,
          fontWeight: 700,
          fontSize: 60,
          padding: "14px 54px",
          borderRadius: 80,
          backgroundColor: BRAND.blue,
          color: BRAND.paper,
        }}
      >
        {url}
      </div>
    </AbsoluteFill>
  );
};

export const CardReel: React.FC<CardReelProps> = ({
  title,
  folder,
  price,
  url,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { safe } = useLayout();
  const titleIn = spring({ frame, fps, config: { damping: 200 } });
  const mediaEnd = CARD_PHOTO_FRAMES + CARD_FLIP_FRAMES;
  const titleOut = interpolate(frame, [mediaEnd - 10, mediaEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const titleHeight = 180;
  // Leave room under the card for the "back" note
  const mediaHeight = safe.height - titleHeight - 30;
  const src = (name: string) => staticFile(`${folder}/${name}.webp`);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 40%, ${BRAND.paper} 0%, ${BRAND.cream} 75%)`,
        color: BRAND.blue,
        textAlign: "center",
      }}
    >
      <AbsoluteFill
        style={{
          paddingTop: safe.top,
          paddingBottom: safe.bottom,
          paddingLeft: safe.side,
          paddingRight: safe.side,
          alignItems: "center",
        }}
      >
        <div
          style={{
            height: titleHeight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: HAND_FONT,
            fontWeight: 700,
            fontSize: 88,
            lineHeight: 1,
            letterSpacing: 2,
            textWrap: "balance",
            opacity: titleIn * titleOut,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 30,
            height: mediaHeight,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Sequence durationInFrames={CARD_PHOTO_FRAMES} layout="none">
            <Photo src={src("photo")} height={mediaHeight} />
          </Sequence>
          <Sequence
            from={CARD_PHOTO_FRAMES}
            durationInFrames={CARD_FLIP_FRAMES}
            layout="none"
          >
            <Flip
              front={src("front")}
              back={src("back")}
              height={mediaHeight}
            />
          </Sequence>
        </div>
      </AbsoluteFill>
      <Sequence from={mediaEnd} durationInFrames={CARD_END_FRAMES}>
        <AbsoluteFill
          style={{ paddingTop: safe.top, paddingBottom: safe.bottom }}
        >
          <EndCard price={price} url={url} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
