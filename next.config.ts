import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first: roughly half the size of WebP for the hero portrait.
    formats: ["image/avif", "image/webp"],
  },};

export default nextConfig;
