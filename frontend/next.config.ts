import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next's built-in image optimizer proxy (/_next/image) was rejecting
    // our own uploaded-image URLs even though they matched remotePatterns.
    // These images are already served straight from the backend and don't
    // need re-optimizing, so skip the optimizer entirely.
    unoptimized: true,
  },
};

export default nextConfig;
