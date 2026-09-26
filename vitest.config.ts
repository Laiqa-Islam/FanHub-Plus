import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Test setup (v2 Phase 16).
 *
 * Scope is deliberate: these tests cover the pure modules where a mistake is a
 * security bug rather than a visual one — the embed parser, the HTML escaper,
 * the media rules and the Cloudinary URL builder. Those are exactly the places
 * where "it looked right when I clicked through it" is not evidence.
 *
 * No jsdom and no component rendering. Adding a DOM would let this suite grow
 * into testing React, which the type checker and the browser already cover
 * better, and would slow the loop that makes these tests worth running.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
});
