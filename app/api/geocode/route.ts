import { NextResponse, type NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

/**
 * City search via OpenStreetMap's Nominatim geocoder.
 *
 * Proxied rather than called from the browser for two reasons that are both
 * Nominatim's own usage policy:
 *
 *  · It requires a genuine identifying User-Agent / Referer. A browser fetch
 *    cannot set User-Agent, so calls from the client are liable to be blocked.
 *  · It asks for at most one request per second. Rate limiting server-side is
 *    the only place that can actually be enforced.
 *
 * Results are cached for a day — city coordinates do not move.
 */

const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }
  if (query.length > 80) {
    return NextResponse.json({ error: "Search term is too long" }, { status: 400 });
  }

  // One shared bucket: Nominatim's limit applies to us as a whole, not per user.
  const limit = await rateLimit("nominatim", 1, 1);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Searching too quickly. Try again in a moment." },
      { status: 429 },
    );
  }

  const url = new URL(NOMINATIM);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "5");
  // Cities, towns and villages only — we are placing events, not addresses.
  url.searchParams.set("featuretype", "settlement");
  url.searchParams.set("addressdetails", "1");

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": `FanHubPlus/1.0 (${APP_URL})`,
        Referer: APP_URL,
        "Accept-Language": "en",
      },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 86_400 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Place search is unavailable" }, { status: 502 });
    }

    const raw = (await response.json()) as Array<{
      display_name: string;
      lat: string;
      lon: string;
      name?: string;
      address?: { country?: string };
    }>;

    return NextResponse.json({
      results: raw.map((place) => ({
        name: place.name ?? place.display_name.split(",")[0],
        label: place.display_name,
        country: place.address?.country ?? "",
        lat: Number(place.lat),
        lng: Number(place.lon),
      })),
    });
  } catch (error) {
    console.error("[api/geocode] Nominatim request failed:", error);
    return NextResponse.json({ error: "Place search is unavailable" }, { status: 504 });
  }
}
