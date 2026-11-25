import { ImageResponse } from "next/og";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Nuon Hokseng — Full-Stack Web Developer in Cambodia";
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#fafaf7",
        color: "#203a34",
        padding: "65px 72px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
        }}
      >
        <span>Open to web developer roles</span>
        <span>Cambodia</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 100, fontWeight: 700, letterSpacing: -5 }}>
          Nuon Hokseng.
        </div>
        <div style={{ fontSize: 39 }}>Full-stack web developer</div>
        <div style={{ fontSize: 27, color: "#5c6964" }}>
          2.5 years building useful web products.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          paddingTop: 24,
          borderTop: "1px solid #d9dfd8",
        }}
      >
        <span>Next.js · TypeScript · NestJS · PostgreSQL</span>
        <span>NH.</span>
      </div>
    </div>,
    size,
  );
}
