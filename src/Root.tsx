import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import "./Social/fonts";
import {
  CardShowcase,
  cardShowcaseSchema,
  getShowcaseDuration,
  type CardShowcaseProps,
} from "./Social/CardShowcase";

// Shared content for the Facebook & Instagram videos. Edit here, or live in
// the Studio sidebar (npm run dev).
const showcaseDefaults: CardShowcaseProps = {
  tagline: "pretty little bits for every occasion",
  cards: [
    {
      image: "brand/card-holly-jolly.png",
      label: "Have a holly, jolly Christmas",
    },
    { image: "brand/card-jolly-bright-1.png", label: "Jolly and bright" },
    { image: "brand/card-today-you-are-one.png", label: "Today you are one" },
  ],
  stepsTitle: "Print at home cards",
  steps: [
    { title: "Download", text: "Your PDF arrives the moment you order" },
    { title: "Print", text: "A5 at 100% scale on 250-300gsm card" },
    { title: "Fold", text: "Fold down the centre and write your message" },
    { title: "Give", text: "Ready to gift, post or pop through a letterbox" },
  ],
  stepsFooter: "No post, no waiting.",
  outroTitle: "Find us on Etsy",
  shop: "ElderberrieBlue",
  instagram: "@elderberrieblueofficial",
  cta: "Shop the cards",
};

const showcaseMetadata = ({ props }: { props: CardShowcaseProps }) => ({
  durationInFrames: getShowcaseDuration(props),
});

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Facebook-Instagram">
        {/* Reels & Stories (FB + IG) */}
        <Composition
          id="Reel"
          component={CardShowcase}
          schema={cardShowcaseSchema}
          calculateMetadata={showcaseMetadata}
          durationInFrames={getShowcaseDuration(showcaseDefaults)}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={showcaseDefaults}
        />
        {/* Feed post, portrait 4:5 (FB + IG) */}
        <Composition
          id="Feed"
          component={CardShowcase}
          schema={cardShowcaseSchema}
          calculateMetadata={showcaseMetadata}
          durationInFrames={getShowcaseDuration(showcaseDefaults)}
          fps={30}
          width={1080}
          height={1350}
          defaultProps={showcaseDefaults}
        />
        {/* Feed post, square 1:1 (FB + IG) */}
        <Composition
          id="Square"
          component={CardShowcase}
          schema={cardShowcaseSchema}
          calculateMetadata={showcaseMetadata}
          durationInFrames={getShowcaseDuration(showcaseDefaults)}
          fps={30}
          width={1080}
          height={1080}
          defaultProps={showcaseDefaults}
        />
      </Folder>
      <Folder name="Elements">
        <Composition
          id="Logo"
          component={Logo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
        />
        <Composition
          id="Title"
          component={Title}
          durationInFrames={115}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
      </Folder>
      <Composition
        // You can take the "id" to render a video:
        // bunx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
        }}
      />
    </>
  );
};
