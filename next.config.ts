import type { NextConfig } from "next";

import { EMBED_FRAME_ORIGINS } from "./lib/embeds";
import { IMAGE_SOURCE_HOSTS } from "./lib/media-hosts";

/**
 * Security headers (v2 Phase 11).
 *
 * This is deliberately a *partial* CSP. `default-src` and `script-src` are left
 * unset, because locking those down properly needs per-request nonces threaded
 * through the document, and a half-done `script-src` either breaks Next's
 * inline bootstrap or ends up so permissive it certifies nothing. Directives
 * with no fallback declared are unrestricted, so what follows restricts exactly
 * what it names and makes no broader claim.
 *
 * What it does cover is the surface Phase 11 opened: `frame-src` pins embedded
 * players to the four origins `lib/embeds.ts` can produce, so even a bug that
 * got an arbitrary URL into an iframe `src` would fail to load.
 */
const CONTENT_SECURITY_POLICY = [
  `frame-src 'self' ${EMBED_FRAME_ORIGINS.join(" ")}`,
  // Media is either proxied through /api/media (same-origin) or served from our
  // own Cloudinary account. blob: covers locally previewed uploads.
  "media-src 'self' blob: https://res.cloudinary.com",
  // Nothing on this site needs plugins, and this is the classic XSS fallback.
  "object-src 'none'",
  // Stops an injected <base> rewriting every relative URL on the page.
  "base-uri 'self'",
  // Server Actions post back to this origin; nothing should post elsewhere.
  "form-action 'self'",
  // We are never a frame. Equivalent to X-Frame-Options: DENY, but this is the
  // directive modern browsers actually honour.
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    // Next 16 deprecates `images.domains` in favour of remotePatterns.
    // Sourced from one shared list so this can't drift from the streaming
    // allow-list in `app/api/media/route.ts` — see `lib/media-hosts.ts`.
    remotePatterns: IMAGE_SOURCE_HOSTS.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
    // Default in Next 16 is [75] only; we serve a couple of tiers for
    // the media-heavy galleries.
    qualities: [60, 75, 90],
  },

  experimental: {
    serverActions: {
      /**
       * Server Action bodies default to 1MB, which quietly capped every upload
       * well below the 5MB the avatar form advertises — files over the limit
       * failed before reaching Cloudinary.
       *
       * Member media doesn't come through here at all: it goes browser-direct to
       * Cloudinary (see `lib/cloudinary.ts#signUpload`), precisely so that video
       * never has to be buffered in this process. 6MB covers the avatar path with
       * room for multipart overhead, and nothing more.
       */
      bodySizeLimit: "6mb",
    },
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // The events explorer asks for geolocation to sort by distance, so
          // that stays available to this origin — but not to embedded players,
          // which `self` excludes. Camera and microphone are used by nothing.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },

  // Mongoose ships optional native deps it resolves lazily; keep it on the
  // Node side of the bundle rather than letting Turbopack trace into it.
  serverExternalPackages: ["mongoose"],
};

export default nextConfig;
