import "server-only";
import type { SortOrder } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Content } from "@/models";
import { CATEGORY_SLUGS, CONTENT_TYPES } from "@/lib/constants";
import { embedThumbnail } from "@/lib/embeds";

/**
 * Filters are assembled from URL params, so their values are widened strings.
 * Mongoose 9's generated filter types insist on the schema's literal enums and
 * reject those, so queries are built as plain objects and cast exactly once,
 * here, where the values have already been validated against the allow-lists
 * in `parseFilters`.
 */
type LooseFilter = Record<string, unknown>;
type ContentFilter = Parameters<typeof Content.find>[0];

const asContentFilter = (filter: LooseFilter) =>
  filter as unknown as ContentFilter;

/**
 * Query layer for the Content Explorer (SRS FR-3).
 *
 * Every filter is expressed as a URL search param, which makes any result set
 * shareable, bookmarkable and back-button friendly — and means the filter UI
 * can stay a thin client component over `useRouter`.
 */

export type ExploreParams = {
  q?: string;
  category?: string;
  type?: string;
  genre?: string;
  year?: string;
  sort?: string;
  page?: string;
};

export type ExploreFilters = {
  q: string;
  category: string;
  type: string;
  genre: string;
  year: string;
  sort: "latest" | "popular" | "alphabetical";
  page: number;
};

export const PAGE_SIZE = 12;

/** One dated milestone on an article's timeline. */
export type TimelineEntry = { label: string; title: string; body: string };

/** Normalises raw search params, discarding anything not on the allow-list. */
export function parseFilters(params: ExploreParams): ExploreFilters {
  const sort = params.sort;
  return {
    q: (params.q ?? "").trim().slice(0, 80),
    category: CATEGORY_SLUGS.includes(params.category as never)
      ? params.category!
      : "",
    type: CONTENT_TYPES.includes(params.type as never) ? params.type! : "",
    genre: (params.genre ?? "").trim().slice(0, 40),
    year: /^\d{4}$/.test(params.year ?? "") ? params.year! : "",
    sort: sort === "popular" || sort === "alphabetical" ? sort : "latest",
    page: Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1),
  };
}

function buildQuery(filters: ExploreFilters): LooseFilter {
  const query: LooseFilter = { status: "published" };

  if (filters.category) query.category = filters.category;
  if (filters.type) query.type = filters.type;
  if (filters.genre) query.genre = filters.genre;

  if (filters.year) {
    const year = Number(filters.year);
    query.releaseDate = {
      $gte: new Date(year, 0, 1),
      $lt: new Date(year + 1, 0, 1),
    };
  }

  if (filters.q) {
    // Escape the input before it becomes a regex, or a stray "(" from a user
    // search throws instead of returning no results.
    const safe = filters.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(safe, "i");
    query.$or = [{ title: pattern }, { summary: pattern }, { tags: pattern }];
  }

  return query;
}

const SORTS: Record<ExploreFilters["sort"], Record<string, SortOrder>> = {
  latest: { releaseDate: -1, createdAt: -1 },
  popular: { popularityScore: -1, viewCount: -1 },
  alphabetical: { title: 1 },
};

export type ContentListItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: string;
  summary: string;
  coverImage: string;
  genre: string[];
  releaseDate: string | null;
  popularityScore: number;
  viewCount: number;
  averageRating: number;
  ratingCount: number;
  mediaUrl: string;
  mediaPoster: string;
  mediaCredit: string;
  mediaRuntime: string;
  mediaTags: string[];
  /** Ordered plates for an image piece (v2 Phase 12). */
  gallery: GalleryPlate[];
  /** Embedded player, as provider + id — never a URL (v2 Phase 11). */
  embedProvider: string;
  embedId: string;
  /** Transcript for audio and video (v2 Phase 16). Plain text. */
  transcript: string;
};

export type GalleryPlate = {
  url: string;
  caption: string;
  width: number;
  height: number;
};

/** Normalises an embedded media subdocument, whatever shape Mongo hands back. */
function toPlate(raw: unknown): GalleryPlate {
  const asset = (raw ?? {}) as Record<string, unknown>;
  return {
    url: String(asset.url ?? ""),
    caption: String(asset.caption ?? ""),
    width: Number(asset.width ?? 0),
    height: Number(asset.height ?? 0),
  };
}

function toListItem(doc: Record<string, unknown>): ContentListItem {
  const ratingCount = Number(doc.ratingCount ?? 0);
  const ratingSum = Number(doc.ratingSum ?? 0);

  const embedProvider = String(doc.embedProvider ?? "");
  const embedId = String(doc.embedId ?? "");

  // An embedded piece holds no image of ours, which would leave its card blank.
  // Where the provider exposes a thumbnail from the id alone, use it — resolved
  // here so every card, list and share preview gets it without asking.
  const coverImage =
    String(doc.coverImage ?? "") || embedThumbnail(embedProvider, embedId);

  return {
    id: String(doc._id),
    title: String(doc.title ?? ""),
    slug: String(doc.slug ?? ""),
    category: String(doc.category ?? ""),
    type: String(doc.type ?? ""),
    summary: String(doc.summary ?? ""),
    coverImage,
    genre: (doc.genre as string[]) ?? [],
    releaseDate: doc.releaseDate
      ? new Date(doc.releaseDate as string).toISOString()
      : null,
    popularityScore: Number(doc.popularityScore ?? 0),
    viewCount: Number(doc.viewCount ?? 0),
    averageRating: ratingCount > 0 ? ratingSum / ratingCount : 0,
    ratingCount,
    mediaUrl: String(doc.mediaUrl ?? ""),
    mediaPoster: String(doc.mediaPoster ?? ""),
    mediaCredit: String(doc.mediaCredit ?? ""),
    mediaRuntime: String(doc.mediaRuntime ?? ""),
    mediaTags: (doc.mediaTags as string[]) ?? [],
    gallery: ((doc.gallery as unknown[]) ?? [])
      .map(toPlate)
      .filter((plate) => plate.url),
    embedProvider,
    embedId,
    transcript: String(doc.transcript ?? ""),
  };
}

/** Everything playable, for the Multimedia Center (SRS FR-5). */
export async function getMediaLibrary(type?: string) {
  await connectToDatabase();
  const filter: LooseFilter = {
    status: "published",
    type:
      type && ["video", "audio", "image"].includes(type)
        ? type
        : { $in: ["video", "audio", "image"] },
  };

  const docs = await Content.find(asContentFilter(filter))
    .sort({ popularityScore: -1, createdAt: -1 })
    .lean();

  return docs.map((doc) =>
    toListItem(doc as unknown as Record<string, unknown>),
  );
}

export async function searchContent(filters: ExploreFilters) {
  await connectToDatabase();
  const query = buildQuery(filters);

  const [docs, total] = await Promise.all([
    Content.find(asContentFilter(query))
      .sort(SORTS[filters.sort])
      .skip((filters.page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    Content.countDocuments(asContentFilter(query)),
  ]);

  return {
    items: docs.map((doc) =>
      toListItem(doc as unknown as Record<string, unknown>),
    ),
    total,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

/**
 * Genres and years present in the data, so the filter dropdowns only ever
 * offer combinations that can actually return something.
 */
export async function getFilterFacets(category?: string) {
  await connectToDatabase();
  const match: LooseFilter = { status: "published" };
  if (category) match.category = category;

  const [genres, years] = await Promise.all([
    Content.distinct("genre", asContentFilter(match)) as unknown as Promise<
      string[]
    >,
    Content.aggregate<{ _id: number }>([
      { $match: match },
      { $group: { _id: { $year: "$releaseDate" } } },
      { $sort: { _id: -1 } },
    ]),
  ]);

  return {
    genres: genres.filter(Boolean).sort(),
    years: years.map((y) => y._id).filter(Boolean),
  };
}

/** Single article/video/audio/image record by slug. */
export async function getContentBySlug(slug: string) {
  await connectToDatabase();
  const doc = await Content.findOne({ slug, status: "published" }).lean();
  if (!doc) return null;
  const raw = doc as unknown as Record<string, unknown>;
  return {
    ...toListItem(raw),
    body: String(raw.body ?? ""),
    // Only the detail page renders the chronology, so it is read here rather
    // than widened into the list item every card on the site carries.
    timeline: ((raw.timeline as TimelineEntry[] | undefined) ?? []).map(
      (entry) => ({
        label: String(entry.label ?? ""),
        title: String(entry.title ?? ""),
        body: String(entry.body ?? ""),
      }),
    ),
  };
}

/** More from the same channel, excluding the piece being read. */
export async function getRelatedContent(
  category: string,
  excludeSlug: string,
  limit = 3,
) {
  await connectToDatabase();
  const docs = await Content.find(
    asContentFilter({
      status: "published",
      category,
      slug: { $ne: excludeSlug },
    }),
  )
    .sort({ popularityScore: -1 })
    .limit(limit)
    .lean();
  return docs.map((doc) =>
    toListItem(doc as unknown as Record<string, unknown>),
  );
}

/**
 * Records a read. Fire-and-forget: a failed counter must never take down the
 * page the reader actually asked for.
 */
export async function incrementViewCount(slug: string) {
  try {
    await connectToDatabase();
    await Content.updateOne({ slug }, { $inc: { viewCount: 1 } });
  } catch (error) {
    console.error("[queries] view count increment failed:", error);
  }
}

/** Serialises filters back into a query string, dropping empties. */
export function buildSearchParams(
  filters: Partial<ExploreFilters>,
  overrides: Partial<Record<keyof ExploreFilters, string | number>> = {},
) {
  const params = new URLSearchParams();
  const merged = { ...filters, ...overrides };

  for (const [key, value] of Object.entries(merged)) {
    if (value === "" || value === undefined || value === null) continue;
    if (key === "page" && Number(value) === 1) continue;
    if (key === "sort" && value === "latest") continue;
    params.set(key, String(value));
  }

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
