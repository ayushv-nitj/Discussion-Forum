import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ This disables ESLint errors from blocking the build
  },
  // other config options if needed
};

export default nextConfig;
