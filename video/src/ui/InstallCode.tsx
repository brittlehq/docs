import { useCurrentFrame, useVideoConfig } from "remotion";
import { ease } from "../lib/easing";
import { C, FONT_HEAD, FONT_MONO } from "./tokens";
import { Card } from "./RunsList";

interface Line {
  text: string;
  kind: "comment" | "command" | "yaml-key" | "yaml-value" | "ok" | "prompt";
}

const LINES: Line[] = [
  { text: "$ cat docker-compose.yml", kind: "command" },
  { text: "services:", kind: "yaml-key" },
  { text: "  brittle:", kind: "yaml-key" },
  { text: "    image: ghcr.io/brittlehq/brittle:latest", kind: "yaml-value" },
  { text: "  postgres:", kind: "yaml-key" },
  { text: "    image: postgres:16-alpine", kind: "yaml-value" },
  { text: "", kind: "comment" },
  { text: "$ docker compose up -d", kind: "command" },
  { text: " ✓ Network created", kind: "ok" },
  { text: " ✓ Container brittle  Started", kind: "ok" },
  { text: " ✓ Container postgres  Healthy", kind: "ok" },
  { text: "$ _", kind: "prompt" },
];

const COLORS: Record<Line["kind"], string> = {
  comment: C.fgSubtle,
  command: C.fg,
  "yaml-key": C.fg,
  "yaml-value": C.accent,
  ok: C.success,
  prompt: C.fgMuted,
};

/**
 * Terminal-themed install mock. Lines stream in one at a time on a
 * staggered timeline, with a slight typewriter feel (each line snaps
 * fully in rather than character-by-character; faster to read at a
 * glance). The OK rows pop with a small color flash.
 */
export const InstallCode: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Card width={780}>
      {/* Terminal chrome */}
      <div
        style={{
          height: 38,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%), " +
            C.surface2,
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 16px",
        }}
      >
        <Dot color="#ff5f56" />
        <Dot color="#ffbd2e" />
        <Dot color="#27c93f" />
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontFamily: FONT_MONO,
            fontSize: 11,
            color: C.fgSubtle,
            letterSpacing: "0.05em",
          }}
        >
          brittle ~ zsh
        </div>
      </div>

      {/* Terminal body */}
      <div
        style={{
          padding: "22px 26px 30px",
          background: "#08080a",
          fontFamily: FONT_MONO,
          fontSize: 15,
          lineHeight: 1.65,
        }}
      >
        {LINES.map((line, i) => {
          const delay = fps * 0.25 + i * fps * 0.16;
          const opacity = ease(frame, [delay, delay + fps * 0.25], [0, 1]);
          const x = ease(frame, [delay, delay + fps * 0.3], [-8, 0]);

          // Highlight prefix for command vs ok vs yaml.
          const isCommand = line.kind === "command";
          const isOk = line.kind === "ok";
          const isPrompt = line.kind === "prompt";

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `translateX(${x}px)`,
                color: COLORS[line.kind],
                minHeight: 22,
                display: "flex",
                alignItems: "baseline",
                gap: 6,
              }}
            >
              {isCommand ? (
                <span style={{ color: C.accent, marginRight: 4 }}>$</span>
              ) : null}
              <span>
                {isCommand
                  ? line.text.replace(/^\$\s/, "")
                  : isPrompt
                    ? line.text
                    : line.text}
              </span>
              {isOk ? null : null}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const Dot: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ width: 11, height: 11, borderRadius: 999, background: color }} />
);

/**
 * Re-use of brand head font so consumers importing this file get one
 * symbol rather than two. Not used here, kept for the JSX motion file.
 */
export const _FONT = FONT_HEAD;
