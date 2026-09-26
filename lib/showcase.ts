import "server-only";
import { connectToDatabase } from "@/lib/db";
import { MerchandiseItem, Content } from "@/models";

/**
 * Merchandise showcase and upcoming releases (SRS FR-7).
 *
 * Nothing here carries a price, a stock level or an order path — §1.5 puts
 * purchasing out of scope, so the data model has no room for it by design.
 */

export type MerchItem = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  imageUrl: string;
  gallery: string[];
  tag: string;
  isUpcoming: boolean;
  releaseDate: string | null;
  viewCount: number;
  popularityScore: number;
};

type LooseFilter = Record<string, unknown>;
const asMerchFilter = (f: LooseFilter) => f as unknown as Parameters<typeof MerchandiseItem.find>[0];

function toMerchItem(doc: Record<string, unknown>): MerchItem {
  return {
    id: String(doc._id),
    name: String(doc.name ?? ""),
    slug: String(doc.slug ?? ""),
    category: String(doc.category ?? ""),
    description: String(doc.description ?? ""),
    imageUrl: String(doc.imageUrl ?? ""),
    gallery: (doc.gallery as string[]) ?? [],
    tag: String(doc.tag ?? ""),
    isUpcoming: Boolean(doc.isUpcoming),
    releaseDate: doc.releaseDate ? new Date(doc.releaseDate as string).toISOString() : null,
    viewCount: Number(doc.viewCount ?? 0),
    popularityScore: Number(doc.popularityScore ?? 0),
  };
}

export async function getMerch(options: {
  category?: string;
  tag?: string;
  upcomingOnly?: boolean;
}) {
  await connectToDatabase();
  const filter: LooseFilter = {};
  if (options.category) filter.category = options.category;
  if (options.tag) filter.tag = options.tag;
  if (options.upcomingOnly) filter.isUpcoming = true;

  const docs = await MerchandiseItem.find(asMerchFilter(filter))
    .sort({ isUpcoming: -1, releaseDate: -1 })
    .lean();

  return docs.map((doc) => toMerchItem(doc as unknown as Record<string, unknown>));
}

/** Groups the showcase by fandom, which is how the SRS asks for it. */
export async function getMerchByCategory(category?: string) {
  const items = await getMerch({ category });
  const grouped = new Map<string, MerchItem[]>();
  for (const item of items) {
    const bucket = grouped.get(item.category) ?? [];
    bucket.push(item);
    grouped.set(item.category, bucket);
  }
  return grouped;
}

export async function getMerchBySlug(slug: string) {
  await connectToDatabase();
  const doc = await MerchandiseItem.findOne({ slug }).lean();
  return doc ? toMerchItem(doc as unknown as Record<string, unknown>) : null;
}

export async function getRelatedMerch(category: string, excludeSlug: string, limit = 4) {
  await connectToDatabase();
  const docs = await MerchandiseItem.find(
    asMerchFilter({ category, slug: { $ne: excludeSlug } }),
  )
    .sort({ popularityScore: -1 })
    .limit(limit)
    .lean();
  return docs.map((doc) => toMerchItem(doc as unknown as Record<string, unknown>));
}

/** Popularity tracking (SRS FR-7, optional). Best-effort, never blocking. */
export async function incrementMerchViews(slug: string) {
  try {
    await connectToDatabase();
    await MerchandiseItem.updateOne({ slug }, { $inc: { viewCount: 1 } });
  } catch (error) {
    console.error("[showcase] merch view increment failed:", error);
  }
}

export type UpcomingEntry = {
  id: string;
  kind: "merchandise" | "content";
  title: string;
  href: string;
  category: string;
  description: string;
  imageUrl: string;
  tag: string;
  releaseDate: string | null;
};

/**
 * The upcoming-releases feed: anticipated merch drops alongside content dated
 * in the future, merged into one chronological run.
 */
export async function getUpcoming(category?: string): Promise<UpcomingEntry[]> {
  await connectToDatabase();
  const now = new Date();

  const merchFilter: LooseFilter = { isUpcoming: true };
  const contentFilter: LooseFilter = { status: "published", releaseDate: { $gt: now } };
  if (category) {
    merchFilter.category = category;
    contentFilter.category = category;
  }

  const [merch, content] = await Promise.all([
    MerchandiseItem.find(asMerchFilter(merchFilter)).sort({ releaseDate: 1 }).lean(),
    Content.find(contentFilter as never).sort({ releaseDate: 1 }).limit(12).lean(),
  ]);

  const entries: UpcomingEntry[] = [
    ...merch.map((item) => ({
      id: String(item._id),
      kind: "merchandise" as const,
      title: item.name,
      href: `/merch/${item.slug}`,
      category: item.category,
      description: item.description ?? "",
      imageUrl: item.imageUrl ?? "",
      tag: item.tag ?? "",
      releaseDate: item.releaseDate ? new Date(item.releaseDate).toISOString() : null,
    })),
    ...content.map((item) => ({
      id: String(item._id),
      kind: "content" as const,
      title: item.title,
      href: `/content/${item.slug}`,
      category: item.category,
      description: item.summary ?? "",
      imageUrl: item.coverImage ?? "",
      tag: item.type ?? "",
      releaseDate: item.releaseDate ? new Date(item.releaseDate).toISOString() : null,
    })),
  ];

  // Undated entries sort last rather than jumping to the front.
  return entries.sort((a, b) => {
    if (!a.releaseDate) return 1;
    if (!b.releaseDate) return -1;
    return a.releaseDate.localeCompare(b.releaseDate);
  });
}
