import { AbsoluteFill, Img, staticFile } from "remotion";
import { z } from "zod";
import { HAND_FONT, SERIF_FONT } from "./fonts";
import { BRAND } from "./layout";

// A still image for feed posts: one card on the brand background, sized
// 4:5 so Instagram accepts it (taller card artwork alone is rejected).
export const cardPostSchema = z.object({
  image: z.string().describe("File in public/, e.g. brand/card.png"),
  title: z.string(),
  footer: z.string(),
});

export type CardPostProps = z.infer<typeof cardPostSchema>;

export const CardPost: React.FC<CardPostProps> = ({ image, title, footer }) => {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 45%, ${BRAND.paper} 0%, ${BRAND.cream} 80%)`,
        alignItems: "center",
        color: BRAND.blue,
        textAlign: "center",
      }}
    >
      <div
        style={{
          marginTop: 60,
          height: 110,
          display: "flex",
          alignItems: "center",
          fontFamily: HAND_FONT,
          fontWeight: 700,
          fontSize: 86,
          lineHeight: 1,
          letterSpacing: 3,
          padding: "0 70px",
        }}
      >
        {title}
      </div>
      <Img
        src={staticFile(image)}
        style={{
          marginTop: 30,
          height: 940,
          width: 940 * 0.705,
          borderRadius: 6,
          boxShadow: "0 22px 50px rgba(43, 84, 175, 0.25)",
          transform: "rotate(-2deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 40,
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: SERIF_FONT,
          fontStyle: "italic",
          fontSize: 34,
        }}
      >
        <Img
          src={staticFile("brand/logo.png")}
          style={{ width: 70, height: 70 }}
        />
        {footer}
      </div>
    </AbsoluteFill>
  );
};
