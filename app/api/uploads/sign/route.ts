import { NextResponse, type NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/dal";
import { rateLimit } from "@/lib/rate-limit";
import { signUpload } from "@/lib/cloudinary";
import { isMediaKind, MEDIA_RULES } from "@/lib/media-kinds";

/**
 * Issues one short-lived credential for a browser-to-Cloudinary upload
 * (v2 Phase 10).
 *
 * This endpoint hands out the ability to write into the project's Cloudinary
 * account, so it is gated as tightly as the upload path it enables:
 *
 *  · Signed-in, email-confirmed members only — the same bar as submitting.
 *  · Rate limited, because each signature is a write and quota is finite.
 *  · The caller chooses only a media *kind*. The destination path is decided
 *    server-side inside the member's own folder and signed, so a leaked
 *    credential can overwrite exactly one object and reach nothing else.
 *
 * What comes back is safe to expose: `api_key` is a public identifier, and the
 * signature is scoped to one public_id and expires with its timestamp. The API
 * secret never leaves the server.
 */
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Sign in to upload media." },
      { status: 401 },
    );
  }
  if (!user.emailVerified) {
    return NextResponse.json(
      { error: "Confirm your email address before uploading media." },
      { status: 403 },
    );
  }

  // Generous enough for a photo set, tight enough that a scripted loop can't
  // burn through the account's storage quota.
  const limit = await rateLimit(`upload-sign:${user.id}`, 40, 3600);
  if (!limit.ok) {
    return NextResponse.json(
      {
        error: `Too many uploads for now. Try again in ${limit.retryAfterSeconds}s.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const kind = (body as { kind?: unknown })?.kind;
  if (!isMediaKind(kind)) {
    return NextResponse.json(
      { error: "Unsupported media kind." },
      { status: 400 },
    );
  }

  try {
    const credential = signUpload(user.id, kind);
    return NextResponse.json(
      { ...credential, accept: MEDIA_RULES[kind].mimes },
      // A signature is per-request and must never be reused from a cache.
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[api/uploads/sign] signing failed:", error);
    return NextResponse.json(
      { error: "Uploads aren't configured on this server." },
      { status: 503 },
    );
  }
}
