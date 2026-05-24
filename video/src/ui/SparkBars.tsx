import { useCurrentFrame, useVideoConfig } from "remotion";
import { ease } from "../lib/easing";
import { C, FONT_BODY, FONT_HEAD, FONT_MONO } from "./tokens";
import { Card } from "./RunsList";

/**
 * Per-test history mock. 30-day pass/fail ladder draws in left to right
 * with each bar easing up from zero height. Reads as "this test has
 * been mostly green, with three red days mid-month" at a glance.
 *
 * Synthetic data — alternates pattern matches the dashboard's
 * sparkline aesthetic, with one cluster of failures to make the eye
 * pause.
 */
const DAYS: ("pass" | "fail" | "skip")[] = [
  "pass", "pass", "pass", "pass", "pass", "fail", "pass", "pass",
  "pass", "pass", "pass", "fail", "fail", "fail", "pass", "pass",
  "pass", "pass", "pass", "pass", "pass", "pass", "skip", "pass",
  "pass", "pass", "pass", "pass", "pass", "pass",
];

const COLORS = {
  pass: C.success,
  fail: C.danger,
  skip: C.fgSubtle,
};

export const SparkBars: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Card width={820}>
      {/* Header strip */}
      <div
        style={{
          padding: "20px 28px 16px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 12,
            color: C.fgSubtle,
            letterSpacing: "0.06em",
          }}
        >
          tests/search.spec.ts
        </span>
        <span style={{ fontFamily: FONT_HEAD, fontWeight: 600, fontSize: 24, color: C.fg }}>
          results page heading echoes the query
        </span>
      </div>

      {/* KPI strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 0,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <Kpi label="Pass rate" value="87%" tone="warning" />
        <Kpi label="Runs / 30d" value="30" />
        <Kpi label="Failures" value="4" tone="danger" />
        <Kpi label="Avg duration" value="3.2s" />
      </div>

      {/* Spark bars */}
      <div style={{ padding: "28px 28px 32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 6,
            height: 110,
            marginBottom: 16,
          }}
        >
          {DAYS.map((d, i) => {
            // Each bar fades + grows from the bottom on a stagger.
            const start = fps * 0.5 + i * 1.8;
            const height = ease(frame, [start, start + fps * 0.4], [0, 90]);
            const opacity = ease(frame, [start, start + fps * 0.4], [0, 1]);
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height,
                  background: COLORS[d],
                  borderRadius: 3,
                  opacity,
                  boxShadow: d === "fail" ? `0 0 12px ${C.danger}55` : undefined,
                }}
              />
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: FONT_MONO,
            fontSize: 11,
            color: C.fgSubtle,
          }}
        >
          <span>30 days ago</span>
          <span>today</span>
        </div>
      </div>
    </Card>
  );
};

const Kpi: React.FC<{ label: string; value: string; tone?: "danger" | "warning" }> = ({
  label,
  value,
  tone,
}) => {
  const valueColor = tone === "danger" ? C.danger : tone === "warning" ? C.warning : C.fg;
  return (
    <div
      style={{
        padding: "18px 24px",
        borderRight: `1px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: C.fgSubtle,
          fontWeight: 600,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: FONT_HEAD,
          fontWeight: 600,
          fontSize: 26,
          color: valueColor,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
    </div>
  );
};
