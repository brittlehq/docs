import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import "./lib/fonts"; // side-effect: load Space Grotesk + Inter + JetBrains Mono
import { Background } from "./components/Background";
import { SplitScene, type Tilt } from "./components/SplitScene";
import { TitleCard } from "./scenes/TitleCard";
import { EndCard } from "./scenes/EndCard";
import { InstallCode } from "./ui/InstallCode";
import { FrameworkGrid } from "./ui/FrameworkGrid";
import { TokenModal } from "./ui/TokenModal";
import { RunsList } from "./ui/RunsList";
import { FailureRollup } from "./ui/FailureRollup";
import { SparkBars } from "./ui/SparkBars";
import { SessionMediaPanel } from "./ui/SessionMediaPanel";
import { AIClusters } from "./ui/AIClusters";

/**
 * Cinematic product walkthrough. Five scenes, each one a split layout
 * with a bold in-frame headline on one side and a 3D-tilted UI mock on
 * the other. Tilt direction alternates so adjacent scenes feel like
 * distinct edits rather than a slideshow.
 *
 * Native UI components, no screenshots. Each mock matches the actual
 * Brittle dashboard's visual language (palette, typography, surface
 * elevations) so the video looks like the product.
 */

/**
 * Single source of truth for the scene script. The portrait
 * (Instagram-Reels-aspect) variant in `CompositionMobile.tsx` consumes
 * the same array so eyebrows / titles / subs / durations don't drift
 * between the two cuts.
 */
export interface SceneSpec {
  side: "left" | "right";
  eyebrow: string;
  title: string;
  sub: string;
  tilt: Tilt;
  ui: React.ReactNode;
  duration: number; // seconds
}

export const SCENES: SceneSpec[] = [
  {
    side: "left",
    eyebrow: "Self-host",
    title: "Up in one command.",
    sub: "Docker compose plus Postgres. Five minutes from clone to a running hub.",
    tilt: { rotateY: 8, rotateX: 2, translateZ: -40 },
    ui: <InstallCode />,
    duration: 5.0,
  },
  {
    side: "right",
    eyebrow: "Frameworks",
    title: "Plug into your existing tests.",
    sub: "Playwright, WebdriverIO, Jest, Vitest. One reporter line, same dashboard.",
    tilt: { rotateY: -9, rotateX: 3, translateZ: -50 },
    ui: <FrameworkGrid />,
    duration: 5.2,
  },
  {
    side: "left",
    eyebrow: "Auth",
    title: "Mint a token. One paste.",
    sub: "Service or personal. Scoped to a single project. The plaintext is shown once.",
    tilt: { rotateY: 9, rotateX: 2, translateZ: -60 },
    ui: <TokenModal />,
    duration: 4.8,
  },
  {
    side: "right",
    eyebrow: "Runs",
    title: "Every CI run, ready to triage.",
    sub: "Grouped by branch and commit. Failures clustered by file. Always one click from the rest.",
    tilt: { rotateY: -10, rotateX: 3, translateZ: -40 },
    ui: <RunsList />,
    duration: 5.2,
  },
  {
    side: "left",
    eyebrow: "Failure rollup",
    title: "Failures grouped by file.",
    sub: "Tagged NEW · KNOWN · REGRESSED so you skip what you've already triaged.",
    tilt: { rotateY: 8, rotateX: 2, translateZ: -40 },
    ui: <FailureRollup />,
    duration: 5.0,
  },
  {
    side: "right",
    eyebrow: "Flake history",
    title: "Spot the flaky ones, fast.",
    sub: "Thirty-day pass / fail ladder per test. The eye catches the red bars before the brain does.",
    tilt: { rotateY: -7, rotateX: -2, translateZ: -20 },
    ui: <SparkBars />,
    duration: 5.0,
  },
  {
    side: "left",
    eyebrow: "Session detail",
    title: "Video. Trace. Console.",
    sub: "Every artifact your reporter captured, one click away. Scrub through the failure.",
    tilt: { rotateY: 9, rotateX: 2, translateZ: -60 },
    ui: <SessionMediaPanel />,
    duration: 5.2,
  },
  {
    side: "right",
    eyebrow: "Optional AI",
    title: "Cluster failures with your own LLM.",
    sub: "Bring your provider key. Eighteen failures collapse into three patterns. Triage in three decisions.",
    tilt: { rotateY: -8, rotateX: 3, translateZ: -50 },
    ui: <AIClusters />,
    duration: 4.8,
  },
];

export const TITLE_DURATION = 3.0;
export const END_DURATION = 3.5;

export const BrittleDemo: React.FC = () => {
  const { fps } = useVideoConfig();

  const titleFrames = Math.round(TITLE_DURATION * fps);
  const endFrames = Math.round(END_DURATION * fps);

  let cursor = titleFrames;

  return (
    <AbsoluteFill>
      <Background />
      <Sequence durationInFrames={titleFrames} layout={"none"}>
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
            name={`scene-${i + 1}`}
          >
            <SplitScene
              side={scene.side}
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

export const totalDurationInFrames = (fps: number) => {
  const sceneTotal = SCENES.reduce((acc, s) => acc + s.duration, 0);
  return Math.round((TITLE_DURATION + sceneTotal + END_DURATION) * fps);
};
