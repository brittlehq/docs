import { useCurrentFrame, useVideoConfig } from "remotion";
import { ease } from "../lib/easing";
import { C, FONT_BODY, FONT_HEAD, FONT_MONO } from "./tokens";
import { Card } from "./RunsList";

interface Cluster {
  label: string;
  pattern: string;
  count: number;
  example: string;
}

const CLUSTERS: Cluster[] = [
  {
    label: "Timeout on element selector",
    pattern: "locator.waitFor(...) exceeded 90000ms",
    count: 12,
    example: "search.spec.ts › autocomplete suggestions appear",
  },
  {
    label: "Auth redirect loop",
    pattern: "Expected /dashboard, got /login (×3)",
    count: 4,
    example: "auth.spec.ts › admin session persists",
  },
  {
    label: "Visual snapshot drift",
    pattern: "Pixel diff 8.4% above threshold (1%)",
    count: 2,
    example: "visual/snapshots.spec.ts › header logo",
  },
];

/**
 * AI insights mock. Three failure clusters fan in with a staggered
 * scale-up so the panel reads "the LLM grouped these for you". Each
 * cluster shows the synthesized label, the underlying error pattern,
 * a count of affected tests, and one example test name.
 */
export const AIClusters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Card width={780}>
      <div
        style={{
          padding: "18px 24px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Sparkle />
        <span style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 20, color: C.fg }}>
          AI insights
        </span>
        <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.fgSubtle }}>
          · 18 failures across 3 patterns
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: FONT_MONO,
            fontSize: 11,
            color: C.fgSubtle,
            padding: "3px 9px",
            borderRadius: 999,
            background: C.surface2,
          }}
        >
          gemini-2.5-flash
        </span>
      </div>

      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
        {CLUSTERS.map((c, i) => {
          const delay = fps * 0.5 + i * fps * 0.18;
          const opacity = ease(frame, [delay, delay + fps * 0.45], [0, 1]);
          const y = ease(frame, [delay, delay + fps * 0.45], [22, 0]);
          const scale = ease(frame, [delay, delay + fps * 0.45], [0.96, 1]);

          return (
            <div
              key={i}
              style={{
                padding: "16px 18px",
                borderRadius: 10,
                background: C.surface2,
                border: `1px solid ${C.border}`,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                opacity,
                transform: `translateY(${y}px) scale(${scale})`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    fontFamily: FONT_HEAD,
                    fontWeight: 600,
                    fontSize: 17,
                    color: C.fg,
                    flex: 1,
                  }}
                >
                  {c.label}
                </span>
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 12,
                    color: C.accent,
                    padding: "3px 9px",
                    borderRadius: 999,
                    background: C.accentLow,
                    border: `1px solid ${C.accent}40`,
                    fontWeight: 600,
                  }}
                >
                  {c.count} tests
                </span>
              </div>
              <code
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 12,
                  color: C.danger,
                  background: C.dangerLow,
                  padding: "4px 8px",
                  borderRadius: 4,
                  alignSelf: "flex-start",
                  border: `1px solid ${C.danger}30`,
                }}
              >
                {c.pattern}
              </code>
              <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.fgSubtle }}>
                e.g. {c.example}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const Sparkle: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M9 1.5l1.8 4.7L15.5 8l-4.7 1.8L9 14.5 7.2 9.8 2.5 8l4.7-1.8L9 1.5z"
      fill={C.accent}
    />
  </svg>
);
