import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ease } from "../lib/easing";

/**
 * Cinematic dark backdrop with a slow amber-tinted radial bloom in the
 * top-right and a subtle vignette. Re-rendered every frame so the bloom
 * can breathe across the whole composition.
 */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  // Slow drift so the bg never feels static.
  const bloomX = ease(frame, [0, 900], [70, 60]);
  const bloomY = ease(frame, [0, 900], [25, 40]);

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(
            circle at ${bloomX}% ${bloomY}%,
            rgba(232, 137, 59, 0.22) 0%,
            rgba(232, 137, 59, 0.04) 25%,
            transparent 55%
          ),
          radial-gradient(
            circle at 20% 80%,
            rgba(40, 60, 140, 0.15) 0%,
            transparent 60%
          ),
          #0a0a0c
        `,
      }}
    >
      {/* Subtle vignette so the screenshot frames sit in light. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
