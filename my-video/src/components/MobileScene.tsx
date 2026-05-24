import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, ease } from "../lib/easing";
import { C, FONT_BODY, FONT_HEAD } from "../ui/tokens";
import { type Tilt } from "./SplitScene";

/**
 * Portrait (9:16) scene shell. The horizontal SplitScene shrinks both
 * text and UI to unreadable sizes on phone screens; this one stacks
 * them vertically with type sized for thumb-distance viewing.
 *
 * `arrangement` alternates which element gets the top half so the
 * rhythm between scenes still reads as cuts rather than slideshow:
 *   - "text-top"   : eyebrow + headline + sub on top, UI below
 *   - "ui-top"     : UI on top, eyebrow + headline + sub below
 *
 * The 3D tilts are kept but biased toward X (front/back) rather than Y
 * (side-to-side) because rotateY at portrait aspect tends to clip the
 * UI against the canvas edges.
 */
export type MobileArrangement = "text-top" | "ui-top";

interface MobileSceneProps {
  arrangement: MobileArrangement;
  eyebrow?: string;
  title: string;
  sub?: string;
  tilt: Tilt;
  ui: React.ReactNode;
  durationInFrames: number;
}

// UI mocks were designed for a 1920-wide canvas (~880px max width). At
// 1080px portrait we render them slightly larger than native so the
// in-card type reads from thumb distance. The damped tilt below keeps
// the wider geometry from clipping the canvas edges.
const UI_SCALE = 1.05;

// Portrait aspect amplifies rotateY distortion (the UI's far edge
// foreshortens harder when the canvas is narrow). Damp the tilt
// magnitude before applying so the UI stays readable on a phone.
const TILT_DAMP = 0.55;

export const MobileScene: React.FC<MobileSceneProps> = ({
  arrangement,
  eyebrow,
  title,
  sub,
  tilt,
  ui,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stagger eyebrow → title → sub on the way in.
  const eyebrowOpacity = ease(frame, [0, fps * 0.4], [0, 1]);
  const eyebrowY = ease(frame, [0, fps * 0.5], [16, 0]);

  const titleOpacity = ease(frame, [fps * 0.18, fps * 0.7], [0, 1]);
  const titleY = ease(frame, [fps * 0.18, fps * 0.8], [28, 0]);

  const subOpacity = ease(frame, [fps * 0.4, fps * 0.9], [0, 1]);
  const subY = ease(frame, [fps * 0.4, fps * 0.95], [20, 0]);

  // UI entry: slide in from the side it sits on (top or bottom), with
  // a small scale + opacity pop. Direction matches the arrangement so
  // the eye is led toward the headline first.
  const uiEntryY = arrangement === "ui-top" ? -120 : 120;
  const uiSlide = ease(frame, [0, fps * 1.0], [uiEntryY, 0]);
  const uiScale = ease(frame, [0, fps * 1.0], [0.92, 1]);
  const uiOpacity = ease(frame, [0, fps * 0.5], [0, 1]);

  // Slow drift on the tilt through the hold. The base tilt values are
  // damped for portrait, then drifted by the same proportional amount.
  const baseRY = tilt.rotateY * TILT_DAMP;
  const baseRX = tilt.rotateX * TILT_DAMP;
  const driftRY = ease(
    frame,
    [fps * 1.0, durationInFrames],
    [baseRY, baseRY - 0.8],
    EASE.drift,
  );
  const driftRX = ease(
    frame,
    [fps * 1.0, durationInFrames],
    [baseRX, baseRX + 0.4],
    EASE.drift,
  );

  const exitOpacity = ease(
    frame,
    [durationInFrames - fps * 0.5, durationInFrames],
    [1, 0],
    EASE.smoothInOut,
  );

  const textBlock = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: "0 64px",
        alignItems: "center",
        textAlign: "center",
        width: "100%",
      }}
    >
      {eyebrow ? (
        <div
          style={{
            fontFamily: FONT_HEAD,
            fontWeight: 600,
            fontSize: 22,
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
          fontSize: 76,
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
            fontSize: 30,
            lineHeight: 1.45,
            color: C.fgMuted,
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            maxWidth: 880,
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: 2200,
        perspectiveOrigin: "center center",
      }}
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          opacity: uiOpacity,
          transform: `translateY(${uiSlide}px) scale(${UI_SCALE * uiScale}) rotateY(${driftRY}deg) rotateX(${driftRX}deg) translateZ(${tilt.translateZ ?? 0}px)`,
        }}
      >
        {ui}
      </div>
    </div>
  );

  // Top half: ~38% of canvas. Bottom half: rest. The narrower half goes
  // to text, wider half to UI so the mock has room.
  return (
    <AbsoluteFill
      style={{
        opacity: exitOpacity,
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          flex: "0 0 36%",
          display: "flex",
          justifyContent: "center",
          alignItems: arrangement === "text-top" ? "flex-end" : "flex-start",
          paddingTop: arrangement === "text-top" ? 80 : 40,
          paddingBottom: arrangement === "text-top" ? 40 : 80,
        }}
      >
        {arrangement === "text-top" ? textBlock : uiBlock}
      </div>
      <div
        style={{
          flex: "1 1 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: arrangement === "ui-top" ? "40px 0 80px" : "0 0 80px",
        }}
      >
        {arrangement === "ui-top" ? textBlock : uiBlock}
      </div>
    </AbsoluteFill>
  );
};
