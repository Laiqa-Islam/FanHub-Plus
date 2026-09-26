import "server-only";
import { connectToDatabase } from "@/lib/db";
import { Event } from "@/models";
import { categoryBySlug } from "@/lib/constants";

/** Event data shaped for the map and calendar (SRS FR-10). */
export type EventListItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  categoryName: string;
  /** Resolved CSS custom property for the channel ink. */
  ink: string;
  type: string;
  description: string;
  venue: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  startsAt: string;
  endsAt: string | null;
  ticketUrl: string;
  imageUrl: string;
  isHighlight: boolean;
};

/**
 * Channel inks as literal hex rather than `var(--ch-…)`, because Leaflet pins
 * are built as raw HTML strings outside the React tree, where a custom
 * property defined on `:root` still resolves — but the dark-mode value would
 * not track. Fixed hex keeps pins legible on the map's own light tiles in
 * both themes.
 */
const PIN_INK: Record<string, string> = {
  anime: "#ff48a0",
  gaming: "#00a95c",
  movies: "#ff6c2f",
  tv: "#0078bf",
  kpop: "#765ba7",
  comics: "#ff4c65",
  manga: "#00838a",
  cosplay: "#d18700",
};

export async function getEvents(options: { category?: string; city?: string } = {}) {
  await connectToDatabase();

  const filter: Record<string, unknown> = {};
  if (options.category) filter.category = options.category;
  if (options.city) filter.city = options.city;

  const docs = await Event.find(filter as never).sort({ startsAt: 1 }).lean();

  return docs.map((doc): EventListItem => {
    const category = categoryBySlug(doc.category);
    const coordinates = (doc.location?.coordinates ?? [0, 0]) as number[];
    return {
      id: String(doc._id),
      slug: doc.slug,
      title: doc.title,
      category: doc.category,
      categoryName: category?.name ?? doc.category,
      ink: PIN_INK[category?.token ?? "anime"] ?? "#ff2e88",
      type: doc.type,
      description: doc.description ?? "",
      venue: doc.venue ?? "",
      city: doc.city,
      country: doc.country ?? "",
      // Stored as GeoJSON [longitude, latitude].
      lng: coordinates[0] ?? 0,
      lat: coordinates[1] ?? 0,
      startsAt: doc.startsAt.toISOString(),
      endsAt: doc.endsAt ? new Date(doc.endsAt).toISOString() : null,
      ticketUrl: doc.ticketUrl ?? "",
      imageUrl: doc.imageUrl ?? "",
      isHighlight: Boolean(doc.isHighlight),
    };
  });
}

export async function getEventCities(): Promise<string[]> {
  await connectToDatabase();
  const cities = (await Event.distinct("city")) as unknown as string[];
  return cities.filter(Boolean).sort();
}
