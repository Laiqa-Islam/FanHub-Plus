import { Hero } from "@/components/home/hero";
import { Ticker } from "@/components/home/ticker";
import { FeatureSpread } from "@/components/home/channel-grid";
import { FeatureSections } from "@/components/home/feature-sections";
import { connectToDatabase } from "@/lib/db";
import { Content } from "@/models";
import { CATEGORIES } from "@/lib/constants";
import type { ContentListItem } from "@/lib/queries";

export const dynamic = "force-dynamic";

/** Front-page selection: the lead, the contents column, and the clippings. */
async function getFrontPage() {
  const empty = { lead: null as ContentListItem | null, secondary: [], rest: [], total: 0, headlines: [] as string[] };

  try {
    await connectToDatabase();
    const docs = await Content.find({ status: "published" })
      .sort({ popularityScore: -1, createdAt: -1 })
      .limit(13)
      .lean();

    const total = await Content.countDocuments({ status: "published" });

    const items = docs.map((doc) => {
      const ratingCount = Number(doc.ratingCount ?? 0);
      const ratingSum = Number(doc.ratingSum ?? 0);
      return {
        id: String(doc._id),
        title: doc.title,
        slug: doc.slug,
        category: doc.category,
        type: doc.type,
        summary: doc.summary ?? "",
        coverImage: doc.coverImage ?? "",
        genre: (doc.genre as string[]) ?? [],
        releaseDate: doc.releaseDate ? new Date(doc.releaseDate).toISOString() : null,
        popularityScore: Number(doc.popularityScore ?? 0),
        viewCount: Number(doc.viewCount ?? 0),
        averageRating: ratingCount > 0 ? ratingSum / ratingCount : 0,
        ratingCount,
        mediaUrl: doc.mediaUrl ?? "",
        mediaPoster: doc.mediaPoster ?? "",
        mediaCredit: doc.mediaCredit ?? "",
        mediaRuntime: doc.mediaRuntime ?? "",
        mediaTags: (doc.mediaTags as string[]) ?? [],
      } as ContentListItem;
    });

    return {
      lead: items[0] ?? null,
      secondary: items.slice(1, 6),
      rest: items.slice(6, 14),
      total,
      headlines: items.slice(0, 8).map((item) => item.title),
    };
  } catch (error) {
    console.error("[home] front page unavailable:", error);
    return empty;
  }
}

export default async function HomePage() {
  const { lead, secondary, rest, total, headlines } = await getFrontPage();

  // Issue number is derived from the date, so the masthead reads as a run
  // rather than a static string.
  const now = new Date();
  const issueNumber = `${String(now.getFullYear()).slice(2)}.${String(now.getMonth() + 1).padStart(2, "0")}`;

  const feed =
    headlines.length > 0 ? headlines : CATEGORIES.map((c) => `${c.name} — channel open`);

  return (
    <>
      <Hero issueNumber={issueNumber} pieceCount={total} />
      <Ticker items={feed} />
      <FeatureSpread lead={lead} secondary={secondary} rest={rest} />
      <FeatureSections />
    </>
  );
}
