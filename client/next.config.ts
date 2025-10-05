import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["flagsapi.com"],
    unoptimized: true, // ← ADD THIS LINE
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp)$/i,
      type: "assets/resource",
    });
    return config;
  },
};

export default nextConfig;
