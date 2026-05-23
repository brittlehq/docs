import { useCurrentFrame, useVideoConfig } from "remotion";
import { ease } from "../lib/easing";
import { C, FONT_BODY, FONT_HEAD, FONT_MONO } from "./tokens";

interface RunRow {
  name: string;
  branch: string;
  commit: string;
  duration: string;
  failed: number;
  total: number;
  ago: string;
  passing: boolean;
}

const RUNS: RunRow[] = [
  {
    name: "Wikipedia · 2026-05-23",
    branch: "main",
    commit: "a4f9c21",
    duration: "1m 12s",
    failed: 0,
    total: 84,
    ago: "2m ago",
    passing: true,
  },
  {
    name: "Wikipedia · 2026-05-23",
    branch: "fix/auth-redirect",
    commit: "d3e8771",
    duration: "1m 09s",
    failed: 3,
    total: 84,
    ago: "14m ago",
    passing: false,
  },
  {
    name: "Wikipedia · 2026-05-23",
    branch: "main",
    commit: "9bc3120",
    duration: "1m 14s",
    failed: 1,
    total: 84,
    ago: "1h ago",
    passing: false,
  },
  {
    name: "Wikipedia · 2026-05-22",
    branch: "main",
    commit: "771ee8a",
    duration: "1m 11s",
    failed: 0,
    total: 84,
    ago: "yesterday",
    passing: true,
  },
];

/**
 * Mini Runs index card. Four run rows stagger in from below over a beat,
 * with a soft scale on each row's badge so the eye lands on the row
 * shape rather than the chrome.
 */
export const RunsList: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Card title="Runs" subtitle="Wikipedia">
      {RUNS.map((r, i) => {
        const delay = fps * 0.5 + i * fps * 0.15;
        const rowOpacity = ease(frame, [delay, delay + fps * 0.5], [0, 1]);
        const rowY = ease(frame, [delay, delay + fps * 0.5], [24, 0]);

        return (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto auto auto",
              alignItems: "center",
              gap: 18,
              padding: "16px 24px",
              borderBottom: i < RUNS.length - 1 ? `1px solid ${C.border}` : "none",
              opacity: rowOpacity,
              transform: `translateY(${rowY}px)`,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span
                style={{
                  fontFamily: FONT_HEAD,
                  fontWeight: 500,
                  fontSize: 17,
                  color: C.fg,
                }}
              >
                {r.name}
              </span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.fgSubtle }}>
                {r.branch} · {r.commit}
              </span>
            </div>
            <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.fgMuted }}>
              {r.duration}
            </span>
            <StatusPill failed={r.failed} total={r.total} passing={r.passing} />
            <span
              style={{
                fontFamily: FONT_BODY,
                fontSize: 12,
                color: C.fgSubtle,
                minWidth: 80,
                textAlign: "right",
              }}
            >
              {r.ago}
            </span>
            <Chevron />
          </div>
        );
      })}
    </Card>
  );
};

const StatusPill: React.FC<{ failed: number; total: number; passing: boolean }> = ({
  failed,
  total,
  passing,
}) => {
  const color = passing ? C.success : C.danger;
  const bg = passing ? C.successLow : C.dangerLow;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 12px",
        borderRadius: 999,
        background: bg,
        border: `1px solid ${color}33`,
        fontFamily: FONT_MONO,
        fontSize: 12,
        color,
        fontWeight: 600,
        letterSpacing: "0.02em",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 999,
          background: color,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
      {passing ? `${total} passed` : `${failed} failed · ${total - failed} passed`}
    </span>
  );
};

const Chevron: React.FC = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    style={{ color: C.fgSubtle }}
  >
    <path
      d="M5 3l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Generic card chrome used by every UI mock. Card title bar on top,
 * border + shadow that matches the dashboard's surface aesthetic.
 */
export const Card: React.FC<{
  title?: string;
  subtitle?: string;
  width?: number;
  children: React.ReactNode;
}> = ({ title, subtitle, width = 880, children }) => {
  return (
    <div
      style={{
        width,
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        overflow: "hidden",
        boxShadow:
          "0 50px 100px rgba(0,0,0,0.55), 0 16px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {title ? (
        <div
          style={{
            padding: "18px 24px",
            borderBottom: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: `linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%), ${C.surface}`,
          }}
        >
          <span
            style={{
              fontFamily: FONT_HEAD,
              fontWeight: 600,
              fontSize: 20,
              color: C.fg,
            }}
          >
            {title}
          </span>
          {subtitle ? (
            <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.fgSubtle }}>
              · {subtitle}
            </span>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  );
};
