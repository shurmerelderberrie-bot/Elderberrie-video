import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { SocialVideo, socialVideoSchema } from "./Social/SocialVideo";

// Shared settings for Facebook & Instagram: 30fps, 15 seconds
const SOCIAL_FPS = 30;
const SOCIAL_DURATION = 15 * SOCIAL_FPS;
const socialDefaults = {
  headline: "Elderberrie",
  subline: "Your message goes here",
  cta: "Shop now",
  backgroundColor: "#3B1F4A",
  accentColor: "#8E4D9E",
  textColor: "#FFF8EE",
};

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Facebook-Instagram">
        {/* Reels & Stories (FB + IG) */}
        <Composition
          id="Reel"
          component={SocialVideo}
          schema={socialVideoSchema}
          durationInFrames={SOCIAL_DURATION}
          fps={SOCIAL_FPS}
          width={1080}
          height={1920}
          defaultProps={socialDefaults}
        />
        {/* Feed post, portrait 4:5 (FB + IG) */}
        <Composition
          id="Feed"
          component={SocialVideo}
          schema={socialVideoSchema}
          durationInFrames={SOCIAL_DURATION}
          fps={SOCIAL_FPS}
          width={1080}
          height={1350}
          defaultProps={socialDefaults}
        />
        {/* Feed post, square 1:1 (FB + IG) */}
        <Composition
          id="Square"
          component={SocialVideo}
          schema={socialVideoSchema}
          durationInFrames={SOCIAL_DURATION}
          fps={SOCIAL_FPS}
          width={1080}
          height={1080}
          defaultProps={socialDefaults}
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
