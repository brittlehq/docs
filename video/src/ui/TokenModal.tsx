import { useCurrentFrame, useVideoConfig } from "remotion";
import { ease } from "../lib/easing";
import { C, FONT_BODY, FONT_HEAD, FONT_MONO } from "./tokens";

/**
 * Token-created modal mock. Mimics the actual Brittle modal that appears
 * after minting an API token: large `brt_svc_...` value in mono, a
 * copy-to-clipboard pill, the "shown once" warning, and the kind
 * selection chips above. Reveal sequence: chips → name → token reveal
 * → copy CTA → warning.
 */
export const TokenModal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fade = (start: number, range = 0.5) =>
    ease(frame, [start, start + fps * range], [0, 1]);
  const lift = (start: number, range = 0.5) =>
    ease(frame, [start, start + fps * range], [14, 0]);

  // Stagger schedule — each piece lands a beat after the previous.
  const t = {
    chips: fps * 0.3,
    name: fps * 0.55,
    token: fps * 0.95,
    copy: fps * 1.4,
    warn: fps * 1.75,
  };

  // The "copy" button briefly flashes to suggest a click happened.
  const copyFlash =
    ease(frame, [fps * 2.5, fps * 2.7], [0, 1]) *
    (1 - ease(frame, [fps * 2.9, fps * 3.2], [0, 1]));

  return (
    <div
      style={{
        width: 720,
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        overflow: "hidden",
        boxShadow:
          "0 60px 120px rgba(0,0,0,0.6), 0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {/* Modal header */}
      <div
        style={{
          padding: "22px 28px 18px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <span
          style={{
            fontFamily: FONT_HEAD,
            fontWeight: 600,
            fontSize: 22,
            color: C.fg,
          }}
        >
          Token created
        </span>
        <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: C.fgSubtle }}>
          Copy the plaintext now. We never store or display it again.
        </span>
      </div>

      <div style={{ padding: "22px 28px 26px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Kind chips */}
        <div
          style={{
            display: "flex",
            gap: 10,
            opacity: fade(t.chips),
            transform: `translateY(${lift(t.chips)}px)`,
          }}
        >
          <Chip label="Kind" muted />
          <Chip label="service" active />
          <Chip label="personal" />
        </div>

        {/* Name row */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            opacity: fade(t.name),
            transform: `translateY(${lift(t.name)}px)`,
          }}
        >
          <Label>Name</Label>
          <ValueCell>ci-staging</ValueCell>
        </div>

        {/* Token reveal */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            opacity: fade(t.token, 0.6),
            transform: `translateY(${lift(t.token, 0.6)}px)`,
          }}
        >
          <Label>API token</Label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "16px 18px",
              borderRadius: 10,
              background: C.surface2,
              border: `1px solid ${C.accent}55`,
              boxShadow: `0 0 0 4px ${C.accentLow}`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 16,
                color: C.fg,
                letterSpacing: "0.03em",
                flex: 1,
              }}
            >
              brt_svc_a4f9c21d_b3e8771...
            </span>
            <div
              style={{
                position: "relative",
                padding: "8px 14px",
                borderRadius: 8,
                background: C.accent,
                color: "#1a1410",
                fontFamily: FONT_HEAD,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.02em",
                display: "flex",
                alignItems: "center",
                gap: 8,
                opacity: fade(t.copy),
                transform: `translateY(${lift(t.copy)}px)`,
                boxShadow:
                  copyFlash > 0
                    ? `0 0 0 ${4 * copyFlash}px ${C.accent}55`
                    : "none",
              }}
            >
              {copyFlash > 0 ? <CheckIcon /> : <ClipIcon />}
              {copyFlash > 0 ? "Copied" : "Copy"}
            </div>
          </div>
        </div>

        {/* Warning */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 14px",
            borderRadius: 8,
            background: C.warningLow,
            border: `1px solid ${C.warning}40`,
            opacity: fade(t.warn),
            transform: `translateY(${lift(t.warn)}px)`,
          }}
        >
          <WarnIcon />
          <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.warning }}>
            This is the only time we&apos;ll show the plaintext. Lose it, revoke and mint a new one.
          </span>
        </div>
      </div>
    </div>
  );
};

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      fontFamily: FONT_HEAD,
      fontWeight: 600,
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      color: C.fgSubtle,
    }}
  >
    {children}
  </span>
);

const ValueCell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      padding: "10px 14px",
      borderRadius: 8,
      background: C.surface2,
      border: `1px solid ${C.border}`,
      fontFamily: FONT_BODY,
      fontSize: 15,
      color: C.fg,
    }}
  >
    {children}
  </div>
);

const Chip: React.FC<{ label: string; active?: boolean; muted?: boolean }> = ({
  label,
  active,
  muted,
}) => {
  const bg = active ? C.accentLow : C.surface2;
  const border = active ? C.accent + "60" : C.border;
  const color = active ? C.accent : muted ? C.fgSubtle : C.fgMuted;
  return (
    <span
      style={{
        padding: "5px 12px",
        borderRadius: 999,
        border: `1px solid ${border}`,
        background: bg,
        color,
        fontFamily: FONT_HEAD,
        fontSize: 12,
        fontWeight: active ? 600 : 500,
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </span>
  );
};

const ClipIcon: React.FC = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <rect
      x="4"
      y="2"
      width="9"
      height="11"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path d="M3 4v9.5a1.5 1.5 0 001.5 1.5h7" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <path d="M3 8.5l3 3 6.5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WarnIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ color: C.warning }}>
    <path
      d="M8 1.5l7 12.5H1L8 1.5z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M8 6v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="11.6" r="0.85" fill="currentColor" />
  </svg>
);
