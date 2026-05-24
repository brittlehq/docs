import { useCurrentFrame, useVideoConfig } from "remotion";
import { ease } from "../lib/easing";
import { C, FONT_BODY, FONT_HEAD, FONT_MONO } from "./tokens";
import { Card } from "./RunsList";

type FailureKind = "new" | "known" | "regressed";

interface FailureItem {
  name: string;
  duration: string;
  kind: FailureKind;
}

interface FileGroup {
  file: string;
  count: number;
  items: FailureItem[];
}

const GROUPS: FileGroup[] = [
  {
    file: "tests/search.spec.ts",
    count: 2,
    items: [
      { name: "results page heading echoes the query", duration: "14.3s", kind: "regressed" },
      { name: "autocomplete suggestions appear", duration: "12.0s", kind: "known" },
    ],
  },
  {
    file: "tests/article.spec.ts",
    count: 1,
    items: [{ name: "TOC anchor scrolling works", duration: "12.7s", kind: "new" }],
  },
];

/**
 * Failures rollup mock. File-group accordion with NEW / KNOWN /
 * REGRESSED badges, the heart of the Run Detail page. File rows expand
 * one at a time as the scene plays, with badges popping in on a
 * staggered timeline.
 */
export const FailureRollup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Card title="Failures" subtitle="3 across 2 files" width={780}>
      {GROUPS.map((g, gi) => {
        const groupDelay = fps * 0.6 + gi * fps * 0.4;
        const groupOpacity = ease(frame, [groupDelay, groupDelay + fps * 0.4], [0, 1]);
        const groupY = ease(frame, [groupDelay, groupDelay + fps * 0.5], [16, 0]);

        return (
          <div
            key={gi}
            style={{
              opacity: groupOpacity,
              transform: `translateY(${groupY}px)`,
              borderBottom: gi < GROUPS.length - 1 ? `1px solid ${C.border}` : "none",
            }}
          >
            <div
              style={{
                padding: "14px 24px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: C.surface2 + "55",
              }}
            >
              <FileIcon />
              <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: C.fg }}>
                {g.file}
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  padding: "3px 10px",
                  borderRadius: 6,
                  border: `1px solid ${C.border}`,
                  background: C.surface,
                  fontFamily: FONT_MONO,
                  fontSize: 12,
                  color: C.fgMuted,
                }}
              >
                {g.count} failing
              </span>
            </div>
            {g.items.map((it, ii) => {
              const itemDelay = groupDelay + fps * 0.25 + ii * fps * 0.15;
              const itemOpacity = ease(frame, [itemDelay, itemDelay + fps * 0.4], [0, 1]);
              const itemX = ease(frame, [itemDelay, itemDelay + fps * 0.4], [10, 0]);
              return (
                <div
                  key={ii}
                  style={{
                    padding: "14px 24px 14px 56px",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    borderTop: `1px solid ${C.border}33`,
                    opacity: itemOpacity,
                    transform: `translateX(${itemX}px)`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_BODY,
                      fontWeight: 500,
                      fontSize: 15,
                      color: C.fg,
                      flex: 1,
                    }}
                  >
                    {it.name}
                  </span>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.fgSubtle }}>
                    {it.duration}
                  </span>
                  <KindBadge kind={it.kind} />
                </div>
              );
            })}
          </div>
        );
      })}
    </Card>
  );
};

const KIND_META: Record<FailureKind, { label: string; color: string; bg: string }> = {
  new: { label: "NEW", color: C.danger, bg: C.dangerLow },
  known: { label: "KNOWN", color: C.warning, bg: C.warningLow },
  regressed: { label: "REGRESSED", color: C.accent, bg: C.accentLow },
};

const KindBadge: React.FC<{ kind: FailureKind }> = ({ kind }) => {
  const meta = KIND_META[kind];
  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 6,
        background: meta.bg,
        border: `1px solid ${meta.color}40`,
        fontFamily: FONT_HEAD,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.08em",
        color: meta.color,
      }}
    >
      {meta.label}
    </span>
  );
};

const FileIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: C.fgSubtle }}>
    <path
      d="M3 2h6l4 4v8a2 2 0 01-2 2H3V2z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path d="M9 2v4h4" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);
