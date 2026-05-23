import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, ease } from "../lib/easing";
import { C, FONT_BODY, FONT_HEAD } from "../ui/tokens";

/**
 * Two-column scene shell. Big in-frame headline on one side, a UI mock on
 * the other rendered at a 3D angle. Each scene gets a different
 * combination of side + tilt, so the cadence between scenes feels like
 * a real edit, not a slideshow.
 */
export type Tilt = {
  rotateY: number; // negative tilts the right edge toward camera
  rotateX: number; // positive tilts the top edge toward camera
  translateZ?: number; // negative pushes deeper into the frame
};

interface SplitSceneProps {
  side: "left" | "right";
  eyebrow?: string;
  title: string;
  sub?: string;
  tilt: Tilt;
  ui: React.ReactNode;
  durationInFrames: number;
}

export const SplitScene: React.FC<SplitSceneProps> = ({
  side,
  eyebrow,
  title,
  sub,
  tilt,
  ui,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Text entry: stagger eyebrow → title → sub from a soft Y rise.
  const introIn = fps * 1.0;
  const eyebrowOpacity = ease(frame, [0, fps * 0.4], [0, 1]);
  const eyebrowY = ease(frame, [0, fps * 0.5], [16, 0]);

  const titleOpacity = ease(frame, [fps * 0.18, fps * 0.7], [0, 1]);
  const titleY = ease(frame, [fps * 0.18, fps * 0.8], [28, 0]);

  const subOpacity = ease(frame, [fps * 0.4, fps * 0.9], [0, 1]);
  const subY = ease(frame, [fps * 0.4, fps * 0.95], [20, 0]);

  // UI entry: slides in from the side it sits on, with a small scale +
  // depth pop. Holds, then a subtle drift through the hold (camera
  // motion).
  const uiEntryX = side === "right" ? 120 : -120;
  const uiSlide = ease(frame, [0, introIn], [uiEntryX, 0]);
  const uiScale = ease(frame, [0, introIn], [0.92, 1]);
  const uiOpacity = ease(frame, [0, fps * 0.5], [0, 1]);

  // Slow drift through hold so frames never freeze.
  const driftRY = ease(
    frame,
    [introIn, durationInFrames],
    [tilt.rotateY, tilt.rotateY - 1.5],
    EASE.drift,
  );
  const driftRX = ease(
    frame,
    [introIn, durationInFrames],
    [tilt.rotateX, tilt.rotateX + 0.6],
    EASE.drift,
  );

  // Whole scene fades out at the very end.
  const exitOpacity = ease(
    frame,
    [durationInFrames - fps * 0.5, durationInFrames],
    [1, 0],
    EASE.smoothInOut,
  );

  // Text column on the side; flex direction switches based on `side`.
  const textBlock = (
    <div
      style={{
        width: "42%",
        padding: "0 80px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        justifyContent: "center",
      }}
    >
      {eyebrow ? (
        <div
          style={{
            fontFamily: FONT_HEAD,
            fontWeight: 600,
            fontSize: 18,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: C.accent,
            opacity: eyebrowOpacity,
            transform: `translateY(${eyebrowY}px)`,
          }}
        >
          {eyebrow}
        </div>
      ) : null}
      <h1
        style={{
          margin: 0,
          fontFamily: FONT_HEAD,
          fontWeight: 600,
          fontSize: 80,
          lineHeight: 1.04,
          letterSpacing: "-0.025em",
          color: C.fg,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        {title}
      </h1>
      {sub ? (
        <p
          style={{
            margin: 0,
            fontFamily: FONT_BODY,
            fontWeight: 400,
            fontSize: 26,
            lineHeight: 1.5,
            color: C.fgMuted,
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            maxWidth: 540,
          }}
        >
          {sub}
        </p>
      ) : null}
    </div>
  );

  const uiBlock = (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // 3D perspective; child has its own transform-style so rotateX/Y
        // and translateZ are interpreted as depth, not flat 2D.
        perspective: 2200,
        perspectiveOrigin: "center center",
      }}
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          opacity: uiOpacity,
          transform: `translateX(${uiSlide}px) scale(${uiScale}) rotateY(${driftRY}deg) rotateX(${driftRX}deg) translateZ(${tilt.translateZ ?? 0}px)`,
        }}
      >
        {ui}
      </div>
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        opacity: exitOpacity,
        flexDirection: side === "right" ? "row" : "row-reverse",
        alignItems: "stretch",
      }}
    >
      {textBlock}
      {uiBlock}
    </AbsoluteFill>
  );
};
