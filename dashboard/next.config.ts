import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    // It's generally not recommended to disable ESLint, but if you must,
    // this will prevent Next.js from failing the build due to linting issues.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
