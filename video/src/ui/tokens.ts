/**
 * Brand tokens for the UI mocks. Mirrors the actual Brittle dashboard
 * palette (global.css + Tailwind tokens) so the video looks like the
 * product, not a generic dark-mode design.
 */
export const C = {
  bg: "#0a0a0c",
  surface: "#131317",
  surface2: "#1c1c22",
  surface3: "#22232a",
  border: "#2a2a32",
  borderStrong: "#36373f",
  fg: "#f4f4f5",
  fgMuted: "#b4b4bb",
  fgSubtle: "#6e6e78",
  accent: "#E8893B",
  accentLow: "rgba(232, 137, 59, 0.12)",
  accentHigh: "#f5b67a",
  success: "#34d399",
  successLow: "rgba(52, 211, 153, 0.12)",
  danger: "#f87171",
  dangerLow: "rgba(248, 113, 113, 0.12)",
  warning: "#fbbf24",
  warningLow: "rgba(251, 191, 36, 0.12)",
  info: "#60a5fa",
  infoLow: "rgba(96, 165, 250, 0.12)",
} as const;

export const FONT_HEAD = "'Space Grotesk', sans-serif";
export const FONT_BODY = "Inter, sans-serif";
export const FONT_MONO = "'JetBrains Mono', monospace";
