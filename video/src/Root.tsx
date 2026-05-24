import "./index.css";
import { Composition } from "remotion";
import { BrittleDemo, totalDurationInFrames } from "./Composition";
import { BrittleDemoMobile } from "./CompositionMobile";
import { Thumbnail } from "./Thumbnail";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Desktop / landing-page cut: 1920×1080 widescreen */}
      <Composition
        id="BrittleDemo"
        component={BrittleDemo}
        durationInFrames={totalDurationInFrames(FPS)}
        fps={FPS}
        width={1920}
        height={1080}
      />
      {/* Portrait cut for Instagram Reels / TikTok / Shorts: 1080×1920.
          Shares the same scene script as BrittleDemo, rendered through a
          vertical scene shell instead of the horizontal split. */}
      <Composition
        id="BrittleDemoMobile"
        component={BrittleDemoMobile}
        durationInFrames={totalDurationInFrames(FPS)}
        fps={FPS}
        width={1080}
        height={1920}
      />
      {/* Single-frame YouTube thumbnail. 1280×720 (YT standard). Render
          with `npx remotion still Thumbnail out/thumbnail.png`. */}
      <Composition
        id="Thumbnail"
        component={Thumbnail}
        durationInFrames={1}
        fps={FPS}
        width={1280}
        height={720}
      />
    </>
  );
};
