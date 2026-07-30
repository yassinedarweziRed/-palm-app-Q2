import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root — a stray lockfile in a parent folder otherwise makes
  // Next.js guess the wrong root. Keeps local and Vercel builds consistent.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
