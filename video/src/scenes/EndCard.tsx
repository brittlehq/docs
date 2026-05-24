import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ease } from "../lib/easing";
import { Logo } from "../components/Logo";

/**
 * Outro card. Logo pulls back into view as the screenshot scene from
 * scene 7 has just zoomed deep — the inverse motion gives the edit a
 * "step back to remember where we are" rhythm. URL underneath fades in
 * a beat later for the final hold frame.
 */
export const EndCard: React.FC<{ durationInFrames: number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo: pulled back from oversized to settled.
  const logoScale = ease(frame, [0, fps * 1.0], [1.4, 1]);
  const logoOpacity = ease(frame, [0, fps * 0.6], [0, 1]);

  // URL appears after the logo settles.
  const urlDelay = fps * 0.8;
  const urlY = ease(frame, [urlDelay, urlDelay + fps * 0.5], [16, 0]);
  const urlOpacity = ease(frame, [urlDelay, urlDelay + fps * 0.5], [0, 1]);

  // Sub-text after the URL.
  const subDelay = fps * 1.4;
  const subOpacity = ease(frame, [subDelay, subDelay + fps * 0.5], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 28,
      }}
    >
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        <Logo height={160} />
      </div>
      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600,
          fontSize: 44,
          color: "#e8893b",
          letterSpacing: "0.02em",
          opacity: urlOpacity,
          transform: `translateY(${urlY}px)`,
        }}
      >
        brittle.dev
      </div>
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: 22,
          color: "#9b9ba4",
          letterSpacing: "0.01em",
          opacity: subOpacity,
        }}
      >
        Open source. Self-hosted. Bring your own provider.
      </div>
    </AbsoluteFill>
  );
};
