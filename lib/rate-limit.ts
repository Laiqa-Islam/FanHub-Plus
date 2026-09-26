import "server-only";

/**
 * Minimal fixed-window rate limiter held in process memory.
 *
 * Good enough to blunt credential stuffing and feedback-form spam on a single
 * instance. A multi-instance deployment would swap this for Redis — the call
 * signature is designed so only this file changes.
 */

type Bucket = { count: number; resetAt: number };

const globalForLimiter = globalThis as typeof globalThis & {
  _rateBuckets?: Map<string, Bucket>;
};
const buckets = globalForLimiter._rateBuckets ?? new Map<string, Bucket>();
globalForLimiter._rateBuckets = buckets;

export type RateLimitResult = { ok: boolean; retryAfterSeconds: number };

export function rateLimit(key: string, limit: number, windowSeconds: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { ok: true, retryAfterSeconds: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfterSeconds: 0 };
}

/** Clears a bucket after a successful attempt so honest users aren't punished. */
export function resetLimit(key: string) {
  buckets.delete(key);
}

// Opportunistic sweep: drop expired buckets so the map can't grow unbounded.
if (!(globalThis as { _rateSweep?: NodeJS.Timeout })._rateSweep) {
  (globalThis as { _rateSweep?: NodeJS.Timeout })._rateSweep = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (now > bucket.resetAt) buckets.delete(key);
    }
  }, 60_000).unref?.() as unknown as NodeJS.Timeout;
}
