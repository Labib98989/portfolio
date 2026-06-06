import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Dev-only: Next blocks cross-origin requests to dev assets (HMR, /_next/*)
  // from any host other than localhost. When testing on a phone over an ngrok
  // tunnel the browser's origin is the random ngrok subdomain, so whitelist
  // the ngrok domains (wildcards cover the per-session random subdomain).
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok-free.dev",
    "*.ngrok.app",
    "*.ngrok.io",
  ],
};

export default nextConfig;
