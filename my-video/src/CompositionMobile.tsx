import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import "./lib/fonts"; // side-effect: load Space Grotesk + Inter + JetBrains Mono
import { Background } from "./components/Background";
import { MobileScene, type MobileArrangement } from "./components/MobileScene";
import { TitleCard } from "./scenes/TitleCard";
import { EndCard } from "./scenes/EndCard";
import { SCENES, TITLE_DURATION, END_DURATION } from "./Composition";

/**
 * Portrait (9:16) cut of the launch demo, sized for Instagram Reels /
 * TikTok / YouTube Shorts (1080×1920). Reads the same scene script as
 * the desktop composition; only the per-scene layout shell changes.
 *
 * The vertical arrangement alternates between text-top and ui-top per
 * scene, mirroring the way the desktop cut alternates left/right.
 * Tilt definitions are inherited untouched — the MobileScene scales
 * the UI down so the rotateY values still read at portrait aspect.
 */
const ARRANGEMENT_FOR_SIDE = (side: "left" | "right"): MobileArrangement =>
  side === "left" ? "text-top" : "ui-top";

export const BrittleDemoMobile: React.FC = () => {
  const { fps } = useVideoConfig();

  const titleFrames = Math.round(TITLE_DURATION * fps);
  const endFrames = Math.round(END_DURATION * fps);

  let cursor = titleFrames;

  return (
    <AbsoluteFill>
      <Background />

      <Sequence durationInFrames={titleFrames} layout="none">
        <TitleCard durationInFrames={titleFrames} />
      </Sequence>

      {SCENES.map((scene, i) => {
        const dur = Math.round(scene.duration * fps);
        const from = cursor;
        cursor += dur;
        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={dur}
            layout="none"
            name={`m-scene-${i + 1}`}
          >
            <MobileScene
              arrangement={ARRANGEMENT_FOR_SIDE(scene.side)}
              eyebrow={scene.eyebrow}
              title={scene.title}
              sub={scene.sub}
              tilt={scene.tilt}
              ui={scene.ui}
              durationInFrames={dur}
            />
          </Sequence>
        );
      })}

      <Sequence from={cursor} durationInFrames={endFrames} layout="none">
        <EndCard durationInFrames={endFrames} />
      </Sequence>
    </AbsoluteFill>
  );
};
