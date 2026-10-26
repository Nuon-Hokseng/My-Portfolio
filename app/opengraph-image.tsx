import { ImageResponse } from "next/og";

// Generated link-preview card (shown when the portfolio URL is shared).
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Nuon Hokseng — Software Engineer";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px",
          background:
            "linear-gradient(135deg, #1b1830 0%, #2a2350 55%, #3b2a6b 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 99,
              background: "#22c55e",
            }}
          />
          <div style={{ fontSize: 28, color: "#c7c3e0" }}>
            Open to new opportunities
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1.05 }}>
            Nuon Hokseng
          </div>
          <div
            style={{
              fontSize: 46,
              fontWeight: 600,
              background: "linear-gradient(90deg, #8b7dff, #e879f9)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Full-Stack Software Engineer
          </div>
          <div style={{ fontSize: 30, color: "#b9b4d6", maxWidth: 760 }}>
            Next.js · TypeScript · React · Supabase · scalable web apps
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#9b95c2" }}>
          <span>nuonhokseng.sparkbytekh.com</span>
          <span style={{ fontWeight: 700, color: "#8b7dff" }}>NH.</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
