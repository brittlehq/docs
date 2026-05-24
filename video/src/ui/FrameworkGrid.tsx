import { useCurrentFrame, useVideoConfig } from "remotion";
import { ease } from "../lib/easing";
import { C, FONT_HEAD, FONT_MONO } from "./tokens";

interface Framework {
  name: string;
  pkg: string;
  accent: string;
  /** Three-line config snippet showing the wire-in shape per framework. */
  config: { text: string; emphasis?: boolean }[];
}

const FRAMEWORKS: Framework[] = [
  {
    name: "Playwright",
    pkg: "@brittlehq/playwright-reporter",
    accent: "#2EAD33",
    config: [
      { text: "reporter: [" },
      { text: "  ['list']," },
      { text: "  ['@brittlehq/...'],", emphasis: true },
      { text: "],", emphasis: false },
    ],
  },
  {
    name: "WebdriverIO",
    pkg: "@brittlehq/wdio-reporter",
    accent: "#EA5906",
    config: [
      { text: "reporters: [" },
      { text: "  'spec'," },
      { text: "  [BrittleReporter, {...}],", emphasis: true },
      { text: "]," },
    ],
  },
  {
    name: "Jest",
    pkg: "@brittlehq/jest-reporter",
    accent: "#C63D14",
    config: [
      { text: "reporters: [" },
      { text: "  'default'," },
      { text: "  ['@brittlehq/...'],", emphasis: true },
      { text: "]," },
    ],
  },
  {
    name: "Vitest",
    pkg: "@brittlehq/vitest-reporter",
    accent: "#6E9F18",
    config: [
      { text: "test: {" },
      { text: "  reporters: ['default'," },
      { text: "    new BrittleReporter()],", emphasis: true },
      { text: "}," },
    ],
  },
];

/**
 * Two-by-two grid of framework cards. Each card stagger-fades in with a
 * subtle scale pop, the accent stripe at the top tinted to the
 * framework's brand colour so the eye reads "four distinct things".
 */
export const FrameworkGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 18,
        width: 820,
      }}
    >
      {FRAMEWORKS.map((fw, i) => {
        const delay = fps * 0.4 + i * fps * 0.14;
        const opacity = ease(frame, [delay, delay + fps * 0.4], [0, 1]);
        const y = ease(frame, [delay, delay + fps * 0.45], [22, 0]);
        const scale = ease(frame, [delay, delay + fps * 0.45], [0.93, 1]);

        return (
          <div
            key={fw.name}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              overflow: "hidden",
              boxShadow:
                "0 28px 60px rgba(0,0,0,0.45), 0 8px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
              opacity,
              transform: `translateY(${y}px) scale(${scale})`,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Accent stripe + framework name */}
            <div
              style={{
                padding: "16px 20px 14px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: fw.accent,
                  boxShadow: `0 0 12px ${fw.accent}88`,
                }}
              />
              <span
                style={{
                  fontFamily: FONT_HEAD,
                  fontWeight: 600,
                  fontSize: 20,
                  color: C.fg,
                  letterSpacing: "-0.01em",
                }}
              >
                {fw.name}
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  fontFamily: FONT_MONO,
                  fontSize: 10,
                  color: C.fgSubtle,
                }}
              >
                npm
              </span>
            </div>

            {/* Package name */}
            <div
              style={{
                padding: "10px 20px",
                fontFamily: FONT_MONO,
                fontSize: 12,
                color: C.fgMuted,
                background: C.surface2 + "55",
                borderBottom: `1px solid ${C.border}33`,
              }}
            >
              {fw.pkg}
            </div>

            {/* Config snippet */}
            <div
              style={{
                padding: "16px 20px 20px",
                fontFamily: FONT_MONO,
                fontSize: 13,
                lineHeight: 1.7,
              }}
            >
              {fw.config.map((line, li) => (
                <div
                  key={li}
                  style={{
                    color: line.emphasis ? C.accent : C.fgMuted,
                    fontWeight: line.emphasis ? 600 : 400,
                  }}
                >
                  {line.text}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
