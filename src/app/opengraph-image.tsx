import { ImageResponse } from "next/og";
import { ogFonts } from "@/lib/og-fonts";

export const alt = "Xyrus Dimacali, full-stack developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          fontFamily: "Bricolage",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#f2efe3",
          background: "radial-gradient(circle at 50% 120%, #3f5a2e 0%, #0f120d 62%)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 34, fontWeight: 800 }}>
          <span style={{ display: "flex" }}>
            xd<span style={{ color: "#7fa35a" }}>.</span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, fontWeight: 500, color: "#b9cf8f" }}>
            <span style={{ width: 14, height: 14, borderRadius: 7, background: "#7fa35a" }} />
            Available for internships
          </span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 300,
            fontWeight: 800,
            letterSpacing: -14,
            lineHeight: 0.8,
            backgroundImage: "linear-gradient(180deg, #b9cf8f, #7fa35a 45%, #3f5a2e)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          XYRUS
        </div>
        <div style={{ display: "flex", fontSize: 40 }}>full-stack developer who ships code and tests it too.</div>
      </div>
    ),
    { ...size, fonts: [...(await ogFonts())] },
  );
}
