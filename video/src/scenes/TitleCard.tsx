import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, ease } from "../lib/easing";
import { Logo } from "../components/Logo";

/**
 * Opening title card. Logo eases in with a Z push (depth), tagline rises
 * underneath, then the whole composition holds before the next scene
 * cuts in. A subtle ambient drift on the logo keeps the frame alive.
 */
export const TitleCard: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entry: scale-up + opacity. Drift gently throughout the hold.
  const logoScale = ease(frame, [0, fps * 0.8], [0.7, 1]);
  const logoDrift = ease(frame, [fps * 0.8, durationInFrames], [1, 1.03]);
  const logoOpacity = ease(frame, [0, fps * 0.6], [0, 1]);

  // Tagline rises in after the logo.
  const taglineDelay = fps * 0.6;
  const taglineY = ease(
    frame,
    [taglineDelay, taglineDelay + fps * 0.6],
    [24, 0],
  );
  const taglineOpacity = ease(
    frame,
    [taglineDelay, taglineDelay + fps * 0.5],
    [0, 1],
  );

  // Whole card fades out at the end so the cut to scene 1 reads as a fade.
  const outOpacity = ease(
    frame,
    [durationInFrames - fps * 0.5, durationInFrames],
    [1, 0],
    EASE.smoothInOut,
  );

  return (
    <AbsoluteFill
      style={{
        opacity: outOpacity,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 32,
      }}
    >
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale * logoDrift})`,
        }}
      >
        <Logo height={140} />
      </div>
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: 30,
          color: "#b4b4bb",
          letterSpacing: "0.02em",
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
        }}
      >
        Test observability you can actually read.
      </div>
    </AbsoluteFill>
  );
};
