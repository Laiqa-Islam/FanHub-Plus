import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 deprecates `images.domains` in favour of remotePatterns.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
    // Default in Next 16 is [75] only; we serve a couple of tiers for
    // the media-heavy galleries.
    qualities: [60, 75, 90],
  },
  // Mongoose ships optional native deps it resolves lazily; keep it on the
  // Node side of the bundle rather than letting Turbopack trace into it.
  serverExternalPackages: ["mongoose"],
};

export default nextConfig;
