import { AbsoluteFill, Sequence } from "remotion";
import "./lib/fonts";
import { C, FONT_BODY, FONT_HEAD } from "./ui/tokens";
import { FailureRollup } from "./ui/FailureRollup";
import { Logo } from "./components/Logo";

/**
 * YouTube thumbnail. 1280×720 single-frame composition rendered to PNG.
 * Optimised for the YouTube grid: legible at the ~330px preview size
 * but designed to reward the click at full resolution.
 *
 * Hierarchy:
 *   1. Bold left headline catches the eye on the scroll.
 *   2. Tilted FailureRollup card on the right shows the product in
 *      one glance — colorful NEW / KNOWN / REGRESSED badges read
 *      even at 200px wide.
 *   3. Brand mark + URL bottom-left, peripheral.
 *
 * The UI is rendered at static "mid-scene" timing by skipping the
 * stagger animations: every internal `interpolate()` lands at its
 * settled value at frame 0 since the FailureRollup's animation curves
 * clamp to 1 once their start frame is reached. We're forcing
 * `useCurrentFrame` to be high by wrapping in a sequence with from=...
 * — but easier and more legible to just use the natural mid-scene
 * frame which happens automatically when rendered as a still.
 */
export const Thumbnail: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(
            circle at 75% 30%,
            rgba(232, 137, 59, 0.32) 0%,
            rgba(232, 137, 59, 0.08) 24%,
            transparent 56%
          ),
          radial-gradient(
            circle at 12% 80%,
            rgba(40, 60, 140, 0.22) 0%,
            transparent 56%
          ),
          #0a0a0c
        `,
        overflow: "hidden",
      }}
    >
      {/* Subtle vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* LEFT — text column */}
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 0,
          bottom: 0,
          width: 660,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 18,
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontFamily: FONT_HEAD,
            fontWeight: 600,
            fontSize: 19,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: C.accent,
          }}
        >
          Brittle
        </div>
        <h1
          style={{
            margin: 0,
            fontFamily: FONT_HEAD,
            fontWeight: 700,
            fontSize: 108,
            lineHeight: 0.96,
            letterSpacing: "-0.035em",
            color: C.fg,
          }}
        >
          Every CI<br />failure,<br />
          <span style={{ color: C.fg }}>readable</span>
          <span style={{ color: C.accent }}>.</span>
        </h1>
        <p
          style={{
            margin: "10px 0 0",
            fontFamily: FONT_BODY,
            fontWeight: 400,
            fontSize: 26,
            lineHeight: 1.35,
            color: C.fgMuted,
            maxWidth: 540,
          }}
        >
          Self-hosted test observability for Playwright, Jest, WDIO, Vitest.
        </p>

        {/* Brand stripe at bottom — amber crack hairline + URL */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 48,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Logo height={36} />
          <div style={{ width: 1, height: 24, background: C.border }} />
          <span
            style={{
              fontFamily: FONT_HEAD,
              fontWeight: 600,
              fontSize: 22,
              color: C.accent,
              letterSpacing: "0.02em",
            }}
          >
            brittle.dev
          </span>
        </div>
      </div>

      {/* RIGHT — tilted UI card */}
      <div
        style={{
          position: "absolute",
          right: -120,
          top: 0,
          bottom: 0,
          width: 760,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: 1800,
          perspectiveOrigin: "center center",
        }}
      >
        <div
          style={{
            transformStyle: "preserve-3d",
            transform:
              "rotateY(-14deg) rotateX(4deg) rotateZ(-1deg) scale(0.86)",
            filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.65))",
          }}
        >
          {/* The FailureRollup's row + badge stagger animations live on
              an `useCurrentFrame` clock. The thumbnail composition is
              one frame long so without a Sequence shift those animations
              would render at frame 0 (everything still invisible).
              `from={-90}` advances the inner clock past the entry
              schedule so the card renders fully settled. */}
          <Sequence from={-90} layout="none">
            <FailureRollup />
          </Sequence>
        </div>
      </div>

      {/* ATTENTION CALLOUT — sticker-style badge that pops over the UI */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 70,
          transform: "rotate(8deg)",
          padding: "10px 20px",
          borderRadius: 999,
          background: C.accent,
          color: "#1a1410",
          fontFamily: FONT_HEAD,
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: "0.1em",
          boxShadow: `0 12px 32px rgba(232, 137, 59, 0.4), 0 0 0 6px rgba(232, 137, 59, 0.15)`,
          zIndex: 3,
        }}
      >
        OPEN SOURCE
      </div>
    </AbsoluteFill>
  );
};
