import { Hero } from "@/components/home/hero";
import { Ticker } from "@/components/home/ticker";
import { FeatureSpread } from "@/components/home/channel-grid";
import { FeatureSections } from "@/components/home/feature-sections";
import { ChannelWall } from "@/components/home/channel-wall";
import { NowPlaying } from "@/components/home/now-playing";
import { StatsBand } from "@/components/home/stats-band";
import { CharacterRail } from "@/components/home/character-rail";
import { MerchRail } from "@/components/home/merch-rail";
import { EventsStrip } from "@/components/home/events-strip";
import { PullQuote } from "@/components/home/pull-quote";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { getHomeExtras } from "@/lib/home";
import { connectToDatabase } from "@/lib/db";
import { Content } from "@/models";
import { CATEGORIES } from "@/lib/constants";
import type { ContentListItem } from "@/lib/queries";

export const dynamic = "force-dynamic";

/** Front-page selection: the lead, the contents column, and the clippings. */
async function getFrontPage() {
  const empty = {
    lead: null as ContentListItem | null,
    secondary: [],
    rest: [],
    total: 0,
    headlines: [] as string[],
  };

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
        releaseDate: doc.releaseDate
          ? new Date(doc.releaseDate).toISOString()
          : null,
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
  // Both halves of the page are independent reads, so they go out together
  // rather than the lower sections waiting on the editorial spread.
  const [{ lead, secondary, rest, total, headlines }, extras] =
    await Promise.all([getFrontPage(), getHomeExtras()]);

  // Issue number is derived from the date, so the masthead reads as a run
  // rather than a static string.
  const now = new Date();
  const issueNumber = `${String(now.getFullYear()).slice(2)}.${String(now.getMonth() + 1).padStart(2, "0")}`;

  const feed =
    headlines.length > 0
      ? headlines
      : CATEGORIES.map((c) => `${c.name} — channel open`);

  return (
    <>
      <ScrollProgress />
      <Hero issueNumber={issueNumber} pieceCount={total} />
      <Ticker items={feed} />
      <FeatureSpread lead={lead} secondary={secondary} rest={rest} />
      {/* The order below is a descent from "read something" to "join in":
          browse by channel, watch, see the scale of it, meet the cast, then
          the shop and the diary before the sign-up. Each section returns
          null on empty data, so a partial database shortens the page rather
          than breaking it. */}
      <ChannelWall />
      <NowPlaying videos={extras.videos} />
      <StatsBand counts={extras.counts} />
      <CharacterRail characters={extras.characters} />
      <PullQuote />
      <MerchRail items={extras.merch} />
      <EventsStrip events={extras.events} />
      <FeatureSections />
    </>
  );
}
