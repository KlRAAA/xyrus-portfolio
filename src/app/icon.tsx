import { ImageResponse } from "next/og";
import { ogFonts } from "@/lib/og-fonts";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
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
          borderRadius: 8,
          color: "#f2efe3",
          fontSize: 19,
          fontWeight: 800,
          letterSpacing: -1,
        }}
      >
        xd<span style={{ color: "#7fa35a" }}>.</span>
      </div>
    ),
    { ...size, fonts: [...(await ogFonts())] },
  );
}
