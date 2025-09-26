import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  turbopack: {
    // Tell Turbopack where the project root is.
    // The value should be the absolute path to your project root.
    // '__dirname' resolves to the directory where next.config.js is located.
    root: __dirname,
  },
};

export default nextConfig;
