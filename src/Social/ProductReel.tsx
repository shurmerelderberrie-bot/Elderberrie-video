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

// A 9:16 Reel for one card: the sharp listing photo, then the product
// mockup video framed small enough that its low resolution doesn't show,
// then a branded end card.
export const PHOTO_FRAMES = 90;
export const VIDEO_FRAMES = 165;
export const END_FRAMES = 105;
export const PRODUCT_REEL_FRAMES = PHOTO_FRAMES + VIDEO_FRAMES + END_FRAMES;

export const productReelSchema = z.object({
  title: z.string(),
  photo: z.string().describe("Square listing photo in public/"),
  video: z.string().describe("Product mockup video in public/"),
  shop: z.string(),
});

export type ProductReelProps = z.infer<typeof productReelSchema>;

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

const Photo: React.FC<{ photo: string; size: number }> = ({ photo, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useFade(8, 10);
  const pop = spring({ frame, fps, config: { damping: 200 } });
  const zoom = interpolate(frame, [0, PHOTO_FRAMES], [1, 1.08]);

  return (
    <div
      style={{
        width: size,
        height: size,
        overflow: "hidden",
        borderRadius: 24,
        boxShadow: "0 24px 60px rgba(43, 84, 175, 0.22)",
        opacity: fade,
        transform: `scale(${0.94 + 0.06 * pop})`,
      }}
    >
      <Img
        src={staticFile(photo)}
        style={{ width: "100%", height: "100%", transform: `scale(${zoom})` }}
      />
    </div>
  );
};

const Mockup: React.FC<{ video: string; height: number }> = ({
  video,
  height,
}) => {
  const fade = useFade(10, 10);
  return (
    <div
      style={{
        height,
        width: height * (396 / 558),
        overflow: "hidden",
        borderRadius: 24,
        border: `6px solid ${BRAND.paper}`,
        boxShadow: "0 24px 60px rgba(43, 84, 175, 0.22)",
        opacity: fade,
      }}
    >
      <OffthreadVideo
        src={staticFile(video)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

const EndCard: React.FC<{ shop: string }> = ({ shop }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useFade(10, 1);
  const steps = ["Download", "Print", "Fold", "Give"];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 28,
        opacity: fade,
      }}
    >
      <Img
        src={staticFile("brand/logo.png")}
        style={{ width: 300, height: 300 }}
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
        style={{ fontFamily: SERIF_FONT, fontStyle: "italic", fontSize: 40 }}
      >
        No post, no waiting
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: HAND_FONT,
          fontWeight: 700,
          fontSize: 58,
          padding: "14px 54px",
          borderRadius: 80,
          backgroundColor: BRAND.blue,
          color: BRAND.paper,
        }}
      >
        {shop}
      </div>
    </AbsoluteFill>
  );
};

export const ProductReel: React.FC<ProductReelProps> = ({
  title,
  photo,
  video,
  shop,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { safe } = useLayout();
  const titleIn = spring({ frame, fps, config: { damping: 200 } });
  const titleOut = interpolate(
    frame,
    [PHOTO_FRAMES + VIDEO_FRAMES - 10, PHOTO_FRAMES + VIDEO_FRAMES],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const titleHeight = 150;
  const mediaHeight = safe.height - titleHeight - 30;

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
            fontFamily: HAND_FONT,
            fontWeight: 700,
            fontSize: 92,
            lineHeight: 1,
            letterSpacing: 2,
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
          <Sequence durationInFrames={PHOTO_FRAMES} layout="none">
            <Photo photo={photo} size={mediaHeight} />
          </Sequence>
          <Sequence
            from={PHOTO_FRAMES}
            durationInFrames={VIDEO_FRAMES}
            layout="none"
          >
            <Mockup video={video} height={mediaHeight} />
          </Sequence>
        </div>
      </AbsoluteFill>
      <Sequence
        from={PHOTO_FRAMES + VIDEO_FRAMES}
        durationInFrames={END_FRAMES}
      >
        <AbsoluteFill
          style={{
            paddingTop: safe.top,
            paddingBottom: safe.bottom,
          }}
        >
          <EndCard shop={shop} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
