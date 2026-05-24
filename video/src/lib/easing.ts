import { Easing, interpolate } from "remotion";

/**
 * Bezier easing curves used across the demo. The defaults here give the
 * cinematic "soft snap" feel — fast start, slow settle. Borrowed from
 * the Remotion best-practices skill.
 */
export const EASE = {
  cinematic: Easing.bezier(0.16, 1, 0.3, 1),
  smoothInOut: Easing.bezier(0.4, 0, 0.2, 1),
  punchOut: Easing.bezier(0.16, 1, 0.3, 1.05),
  drift: Easing.bezier(0.42, 0, 0.58, 1),
} as const;

/**
 * Helper that clamps both ends and applies the cinematic curve by default.
 * Avoids having to repeat the extrapolate config in every scene file.
 */
export const ease = (
  frame: number,
  input: [number, number],
  output: [number, number],
  curve: (n: number) => number = EASE.cinematic,
) =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: curve,
  });
