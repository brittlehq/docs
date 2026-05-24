import { Audio, interpolate, staticFile, useVideoConfig } from "remotion";

/**
 * Background music for the demo. Sits well under the visuals at 0.55
 * gain, fades in over the first 1.2s so the cold start doesn't pop,
 * and fades out over the last 1.5s so the cut-to-black doesn't feel
 * abrupt.
 *
 * The `volume` prop accepts a per-frame function which Remotion
 * resamples internally for the encoded track.
 */
const TRACK = "the_mountain-product-tech-310134.mp3";
const BASE_GAIN = 0.55;

export const BackgroundMusic: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const { fps } = useVideoConfig();
  const fadeIn = Math.round(fps * 1.2);
  const fadeOut = Math.round(fps * 1.5);

  return (
    <Audio
      src={staticFile(TRACK)}
      volume={(frame) => {
        if (frame < fadeIn) {
          return interpolate(frame, [0, fadeIn], [0, BASE_GAIN], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
        }
        const exitStart = durationInFrames - fadeOut;
        if (frame > exitStart) {
          return interpolate(
            frame,
            [exitStart, durationInFrames],
            [BASE_GAIN, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
        }
        return BASE_GAIN;
      }}
    />
  );
};
