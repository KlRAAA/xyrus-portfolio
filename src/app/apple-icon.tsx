import { ImageResponse } from "next/og";
import { ogFonts } from "@/lib/og-fonts";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          fontFamily: "Bricolage",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f120d",
          color: "#f2efe3",
          fontSize: 96,
          fontWeight: 800,
          letterSpacing: -5,
        }}
      >
        xd<span style={{ color: "#7fa35a" }}>.</span>
      </div>
    ),
    { ...size, fonts: [...(await ogFonts())] },
  );
}
