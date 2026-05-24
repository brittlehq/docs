import { useCurrentFrame, useVideoConfig } from "remotion";
import { ease } from "../lib/easing";
import { C, FONT_BODY, FONT_HEAD, FONT_MONO } from "./tokens";
import { Card } from "./RunsList";

/**
 * Session detail mock. Tab strip across the top (Test results, Video,
 * Trace, Console), with a "playing" video frame as the active panel.
 * The video frame shows a fake play overlay + timeline scrubber so the
 * eye reads "this is the media playback" without needing real footage.
 */

const TABS = [
  { id: "results", label: "Test results", count: 3 },
  { id: "video", label: "Video", count: undefined, active: true },
  { id: "trace", label: "Trace", count: undefined },
  { id: "console", label: "Console", count: 47 },
];

export const SessionMediaPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scrubber moves left-to-right during the hold.
  const scrubX = ease(frame, [fps * 0.6, fps * 4], [4, 96]);

  // Video frame fades + scales in.
  const videoOpacity = ease(frame, [fps * 0.5, fps * 1.1], [0, 1]);
  const videoScale = ease(frame, [fps * 0.5, fps * 1.1], [0.96, 1]);

  return (
    <Card width={880}>
      {/* Tab strip */}
      <div
        style={{
          display: "flex",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 8px",
        }}
      >
        {TABS.map((t, i) => {
          const delay = fps * 0.2 + i * 0.06 * fps;
          const opacity = ease(frame, [delay, delay + fps * 0.3], [0, 1]);
          const active = t.active;
          return (
            <div
              key={t.id}
              style={{
                padding: "16px 18px",
                fontFamily: FONT_HEAD,
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                color: active ? C.fg : C.fgMuted,
                borderBottom: active ? `2px solid ${C.accent}` : "2px solid transparent",
                display: "flex",
                alignItems: "center",
                gap: 8,
                opacity,
              }}
            >
              {t.label}
              {t.count !== undefined ? (
                <span
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    color: C.fgSubtle,
                    padding: "2px 7px",
                    borderRadius: 999,
                    background: C.surface2,
                  }}
                >
                  {t.count}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Video panel */}
      <div
        style={{
          padding: 28,
          opacity: videoOpacity,
          transform: `scale(${videoScale})`,
        }}
      >
        <div
          style={{
            position: "relative",
            aspectRatio: "16 / 9",
            borderRadius: 10,
            overflow: "hidden",
            border: `1px solid ${C.border}`,
            background:
              "linear-gradient(135deg, #2a2a3e 0%, #1a1a26 40%, #0e0e16 100%)",
          }}
        >
          {/* Fake page chrome inside the video frame */}
          <div style={{ position: "absolute", inset: 0, padding: 24 }}>
            <div
              style={{
                height: 22,
                width: "60%",
                background: "rgba(255,255,255,0.08)",
                borderRadius: 4,
                marginBottom: 14,
              }}
            />
            <div
              style={{
                height: 14,
                width: "82%",
                background: "rgba(255,255,255,0.05)",
                borderRadius: 4,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                height: 14,
                width: "70%",
                background: "rgba(255,255,255,0.05)",
                borderRadius: 4,
                marginBottom: 24,
              }}
            />
            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  height: 36,
                  flex: 1,
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 6,
                }}
              />
              <div
                style={{
                  height: 36,
                  width: 100,
                  background: C.accent,
                  borderRadius: 6,
                  opacity: 0.85,
                }}
              />
            </div>
          </div>

          {/* Play badge */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 72,
              height: 72,
              borderRadius: 999,
              background: "rgba(0,0,0,0.55)",
              border: "2px solid rgba(255,255,255,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(8px)",
            }}
          >
            <svg width="22" height="26" viewBox="0 0 22 26" fill="white">
              <polygon points="2,2 20,13 2,24" />
            </svg>
          </div>

          {/* Scrubber */}
          <div
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              bottom: 14,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                position: "relative",
                height: 3,
                background: "rgba(255,255,255,0.15)",
                borderRadius: 999,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  width: `${scrubX}%`,
                  background: C.accent,
                  borderRadius: 999,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: `${scrubX}%`,
                  top: "50%",
                  width: 11,
                  height: 11,
                  marginTop: -5,
                  marginLeft: -5,
                  borderRadius: 999,
                  background: C.accent,
                  boxShadow: `0 0 12px ${C.accent}aa`,
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: FONT_MONO,
                fontSize: 11,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              <span>0:09</span>
              <span>0:12</span>
            </div>
          </div>
        </div>

        {/* Below the video — metadata strip */}
        <div
          style={{
            marginTop: 18,
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: C.fgSubtle,
            fontFamily: FONT_BODY,
            fontSize: 13,
          }}
        >
          <span style={{ color: C.danger, fontWeight: 600 }}>● failed</span>
          <span style={{ fontFamily: FONT_MONO }}>14.3s</span>
          <span>chromium</span>
          <span>retry 1 of 2</span>
        </div>
      </div>
    </Card>
  );
};
