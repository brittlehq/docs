import { AbsoluteFill, Sequence } from "remotion";
import "./lib/fonts";
import { C, FONT_BODY, FONT_HEAD } from "./ui/tokens";
import { FailureRollup } from "./ui/FailureRollup";
import { Logo } from "./components/Logo";

/**
 * YouTube thumbnail. 1280×720 single-frame composition rendered to PNG.
 *
 * Layout: 56/44 horizontal split. Left column carries the eye-catch
 * (big two-line headline + brand mark). Right column shows the
 * product, tilted into the frame at an angle that keeps every edge of
 * the UI card inside the canvas.
 *
 * Earlier iterations clipped the card off the right edge to fake a
 * sense of scale; that hid the badges the thumbnail relies on. This
 * version sits the card with a 40px right margin and a softer rotateY
 * so the whole rollup reads at thumbnail size.
 */
export const Thumbnail: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(
            circle at 78% 30%,
            rgba(232, 137, 59, 0.32) 0%,
            rgba(232, 137, 59, 0.08) 24%,
            transparent 56%
          ),
          radial-gradient(
            circle at 8% 88%,
            rgba(40, 60, 140, 0.20) 0%,
            transparent 55%
          ),
          #0a0a0c
        `,
        overflow: "hidden",
      }}
    >
      {/* Subtle vignette so the corners darken a touch. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* LEFT — text column (~56% of canvas) */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 0,
          bottom: 0,
          width: 660,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 22,
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontFamily: FONT_HEAD,
            fontWeight: 600,
            fontSize: 18,
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
            fontSize: 92,
            lineHeight: 0.98,
            letterSpacing: "-0.035em",
            color: C.fg,
          }}
        >
          Read your CI failures
          <span style={{ color: C.accent }}>.</span>
        </h1>

        <p
          style={{
            margin: 0,
            fontFamily: FONT_BODY,
            fontWeight: 400,
            fontSize: 24,
            lineHeight: 1.4,
            color: C.fgMuted,
            maxWidth: 520,
          }}
        >
          Self-hosted test observability for Playwright, Jest, WDIO, Vitest.
        </p>
      </div>

      {/* RIGHT — fully-visible tilted UI card (~44% of canvas) */}
      <div
        style={{
          position: "absolute",
          right: 40,
          top: 0,
          bottom: 0,
          width: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          perspective: 2000,
          perspectiveOrigin: "center center",
          zIndex: 1,
        }}
      >
        <div
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateY(-9deg) rotateX(3deg) scale(0.7)",
            transformOrigin: "right center",
            filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.6))",
          }}
        >
          {/* FailureRollup runs its row-stagger animations off
              useCurrentFrame; in a 1-frame composition those would
              all be at opacity 0. Advance the clock past the entry
              schedule with from={-90}. */}
          <Sequence from={-90} layout="none">
            <FailureRollup />
          </Sequence>
        </div>
      </div>

      {/* Center play button. Sits absolutely over the whole canvas so
          a reader scanning a YouTube grid (or a README thumbnail link)
          instantly registers this as a clickable video. Semi-opaque
          dark circle with a thick white border + amber-tinted shadow
          carries the brand into the affordance. */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 124,
          height: 124,
          borderRadius: 999,
          background: "rgba(10, 10, 12, 0.6)",
          backdropFilter: "blur(10px)",
          border: "3px solid rgba(255, 255, 255, 0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `
            0 24px 60px rgba(0, 0, 0, 0.6),
            0 0 0 8px rgba(232, 137, 59, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.18)
          `,
          zIndex: 4,
        }}
      >
        <svg
          width="42"
          height="46"
          viewBox="0 0 42 46"
          fill="white"
          aria-hidden="true"
          style={{
            // Optical centering: the triangle's visual centre sits a few
            // pixels right of its bounding-box centre because all the
            // mass is on the leading edge. Nudge left so the play icon
            // looks centered inside the circle.
            marginLeft: 6,
          }}
        >
          <polygon points="2,2 40,23 2,44" />
        </svg>
      </div>

      {/* Brand stripe — logo + URL + open-source tag, all in one
          line, no rotation. Keeps the open-source flag visible
          without competing with the headline. */}
      <div
        style={{
          position: "absolute",
          left: 60,
          bottom: 44,
          display: "flex",
          alignItems: "center",
          gap: 18,
          zIndex: 3,
        }}
      >
        <Logo height={32} />
        <span
          style={{
            fontFamily: FONT_HEAD,
            fontWeight: 600,
            fontSize: 20,
            color: C.accent,
            letterSpacing: "0.02em",
          }}
        >
          brittle.dev
        </span>
        <span style={{ width: 1, height: 18, background: C.border }} />
        <span
          style={{
            padding: "4px 10px",
            borderRadius: 6,
            border: `1px solid ${C.accent}55`,
            background: C.accentLow,
            color: C.accent,
            fontFamily: FONT_HEAD,
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          Open source
        </span>
      </div>
    </AbsoluteFill>
  );
};
