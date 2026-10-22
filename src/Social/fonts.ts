import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const HAND_FONT = "Amatic SC";
export const SERIF_FONT = "Lora";

loadFont({
  family: HAND_FONT,
  url: staticFile("fonts/AmaticSC-Bold.woff2"),
  weight: "700",
});
loadFont({
  family: SERIF_FONT,
  url: staticFile("fonts/Lora-Regular.woff2"),
  weight: "400",
});
loadFont({
  family: SERIF_FONT,
  url: staticFile("fonts/Lora-Italic.woff2"),
  weight: "400",
  style: "italic",
});
