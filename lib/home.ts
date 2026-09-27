/**
 * Front-page data beyond the editorial spread.
 *
 * The home page used to show one thing — the content library — while the seed
 * carries characters, merchandise, events and a playable media shelf that a
 * visitor could only find by guessing at the nav. These queries feed the
 * sections that fix that.
 *
 * Every one is projected down to the fields the cards actually render. The
 * home page is the most-hit route in the app and these run on each request
 * (it is `force-dynamic`), so pulling whole documents back to read four keys
 * off them would be the wrong trade.
 *
 * Failures degrade rather than throw: a section with no rows returns an empty
 * array and the component renders nothing. A dead events collection should
 * cost the visitor the events strip, not the entire front page.
 */
import { connectToDatabase } from "@/lib/db";
import { Content, CharacterProfile, MerchandiseItem, Event } from "@/models";

export type HomeVideo = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  poster: string;
  mediaUrl: string;
  runtime: string;
  tag: string;
};

export type HomeCharacter = {
  slug: string;
  name: string;
  kanji: string;
  franchise: string;
  category: string;
  role: string;
  accent: string;
  imageUrl: string;
};

export type HomeMerch = {
  slug: string;
  name: string;
  category: string;
  priceCents: number;
  tag: string;
  imageUrl: string;
};

export type HomeEvent = {
  slug: string;
  title: string;
  city: string;
  country: string;
  type: string;
  category: string;
  startsAt: string | null;
  imageUrl: string;
};

export type HomeCounts = {
  pieces: number;
  characters: number;
  merch: number;
  events: number;
};

export type HomeExtras = {
  videos: HomeVideo[];
  characters: HomeCharacter[];
  merch: HomeMerch[];
  events: HomeEvent[];
  counts: HomeCounts;
};

const EMPTY: HomeExtras = {
  videos: [],
  characters: [],
  merch: [],
  events: [],
  counts: { pieces: 0, characters: 0, merch: 0, events: 0 },
};

async function getVideos(): Promise<HomeVideo[]> {
  const docs = await Content.find({ status: "published", type: "video" })
    .select(
      "slug title category summary mediaPoster coverImage mediaUrl mediaRuntime mediaTags",
    )
    .sort({ popularityScore: -1 })
    .limit(7)
    .lean();

  return docs.map((doc) => ({
    slug: String(doc.slug),
    title: String(doc.title),
    category: String(doc.category),
    summary: String(doc.summary ?? ""),
    // The poster is a frame from the clip itself; the cover is the fallback
    // for anything seeded before that was true.
    poster: String(doc.mediaPoster || doc.coverImage || ""),
    mediaUrl: String(doc.mediaUrl ?? ""),
    runtime: String(doc.mediaRuntime ?? ""),
    tag: String((doc.mediaTags as string[] | undefined)?.[0] ?? "Video"),
  }));
}

async function getCharacters(): Promise<HomeCharacter[]> {
  const docs = await CharacterProfile.find({})
    .select("slug name kanji franchise category role accent imageUrl")
    .sort({ popularityScore: -1 })
    .limit(24)
    .lean();

  return docs.map((doc) => ({
    slug: String(doc.slug),
    name: String(doc.name),
    kanji: String(doc.kanji ?? ""),
    franchise: String(doc.franchise ?? ""),
    category: String(doc.category ?? "anime"),
    role: String(doc.role ?? ""),
    accent: String(doc.accent ?? ""),
    imageUrl: String(doc.imageUrl ?? ""),
  }));
}

async function getMerch(): Promise<HomeMerch[]> {
  const docs = await MerchandiseItem.find({ isUpcoming: { $ne: true } })
    .select("slug name category priceCents tag imageUrl")
    .sort({ popularityScore: -1 })
    .limit(10)
    .lean();

  return docs.map((doc) => ({
    slug: String(doc.slug),
    name: String(doc.name),
    category: String(doc.category ?? ""),
    priceCents: Number(doc.priceCents ?? 0),
    tag: String(doc.tag ?? ""),
    imageUrl: String(doc.imageUrl ?? ""),
  }));
}

async function getEvents(): Promise<HomeEvent[]> {
  // Soonest first, and only what has not already happened — an "upcoming"
  // strip listing last year's convention is worse than no strip.
  const docs = await Event.find({ startsAt: { $gte: new Date() } })
    .select("slug title city country type category startsAt imageUrl")
    .sort({ startsAt: 1 })
    .limit(4)
    .lean();

  return docs.map((doc) => ({
    slug: String(doc.slug),
    title: String(doc.title),
    city: String(doc.city ?? ""),
    country: String(doc.country ?? ""),
    type: String(doc.type ?? ""),
    category: String(doc.category ?? ""),
    startsAt: doc.startsAt
      ? new Date(doc.startsAt as Date).toISOString()
      : null,
    imageUrl: String(doc.imageUrl ?? ""),
  }));
}

/** Everything the lower half of the front page needs, in one round of queries. */
export async function getHomeExtras(): Promise<HomeExtras> {
  try {
    await connectToDatabase();

    const [
      videos,
      characters,
      merch,
      events,
      pieces,
      charCount,
      merchCount,
      eventCount,
    ] = await Promise.all([
      getVideos(),
      getCharacters(),
      getMerch(),
      getEvents(),
      Content.countDocuments({ status: "published" }),
      CharacterProfile.countDocuments({}),
      MerchandiseItem.countDocuments({}),
      Event.countDocuments({}),
    ]);

    return {
      videos,
      characters,
      merch,
      events,
      counts: {
        pieces,
        characters: charCount,
        merch: merchCount,
        events: eventCount,
      },
    };
  } catch (error) {
    console.error("[home] extras unavailable:", error);
    return EMPTY;
  }
}
