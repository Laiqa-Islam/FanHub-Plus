/**
 * Curated Unsplash image pool.
 *
 * Every id below was fetched and visually checked before being listed, so the
 * subject genuinely matches the channel it sits under. Unsplash photos are
 * free to use commercially without permission, which keeps us clear of the
 * licensing constraint in SRS §1.5 — we never host copyrighted franchise art.
 *
 * Ids are hot-linked through `images.unsplash.com`, which is already declared
 * in `next.config.ts` → `images.remotePatterns`.
 */

const BASE = "https://images.unsplash.com/photo-";

/** Builds a sized, optimised Unsplash URL. */
export function stock(id: string, width = 1200): string {
  return `${BASE}${id}?auto=format&fit=crop&w=${width}&q=75`;
}

/**
 * Photographs grouped by what they actually depict. Several appear under more
 * than one channel where the subject genuinely fits both (a figure photo works
 * for anime and for merch).
 */
export const STOCK = {
  anime: [
    "1581833971358-2c8b550f87b3", // anime-style mural, expressive eyes
    "1578632767115-351597cf2477", // costumed character portrait, red light
    "1607604276583-eef5d076aa5f", // hands arranging anime prints
    "1609372332255-611485350f25", // yellow character plush
    "1620712943543-bcc4688e7485", // articulated robot figure
    "1518709268805-4e9042af9f23", // misty castle, atmospheric
  ],
  gaming: [
    "1627856013091-fed6e4e30025", // handheld console and collectibles
    "1541562232579-512a21360020", // action figure, neon backdrop
    "1552820728-8b83bb6b773f", // controller, low key
    "1493711662062-fa541adb3fc8", // two players, controllers in hand
    "1542751371-adc38448a05e", // esports competitor at a PC
    "1550745165-9bc0b252726f", // retro handhelds and cassettes
    "1600861194942-f883de0dfe96", // ultrawide monitor, controller
    "1560419015-7c427e8ae5ba", // mechanical keyboard and headset
    "1511512578047-dfb367046420", // darkened battlestation
    "1509198397868-475647b2a1e5", // white controller, studio light
    "1547394765-185e1e68f34e", // backlit keys, close crop
  ],
  movies: [
    "1536440136628-849c177e76a1", // neon cinema frontage
    "1440404653325-ab127d49abc1", // film reels and projector
    "1478720568477-152d9b164e26", // projector beam through haze
    "1535016120720-40c646be5580", // red projection beam
    "1485846234645-a62644f84728", // clapperboard on set
    "1598899134739-24c46f58b8c0", // clapperboard and popcorn
    "1596727147705-61a532a659bd", // character figure, blue rim light
    "1589254065878-42c9da997008", // brick-built robot model
    "1519638831568-d9897f54ed69", // camera body on colour field
  ],
  "tv-shows": [
    "1574375927938-d5a98e8ffe85", // streaming interface, ambient red
    "1461151304267-38535e780c79", // television in a living room
    "1601814933824-fd0b574dd592", // character plush, soft focus
    "1516035069371-29a1b244cc32", // camera and lenses
    "1581591524425-c7e0978865fc", // camera bodies, neon lighting
    "1611162616475-46b635cb6868", // video platform icon, 3D
  ],
  "k-pop": [
    "1516450360452-9312f5e86fc7", // crowd, pink and blue wash
    "1499364615650-ec38552f4f34", // stage lighting rig
    "1459749411175-04bf5292ceea", // crowd under warm stage light
    "1524368535928-5b5e00ddc76b", // arena crowd, orange glow
    "1533174072545-7a4b6ad7a6c3", // crowd and light beams
    "1470225620780-dba8ba36b745", // DJ controller, purple light
    "1614680376573-df3480f0c6ff", // music app icon, 3D
    "1493225457124-a3eb161ffa5f", // performer in haze, arms raised
    "1526304640581-d334cdbbf45e", // banknotes, flat lay
  ],
  comics: [
    "1612036782180-6f0b6cd846fe", // stacked single issues
    "1588497859490-85d1c17db96d", // spinner rack covers
    "1531259683007-016a7b628fc3", // caped figure, dramatic light
    "1572044162444-ad60f128bdea", // illustrator, tablet and swatches
    "1522542550221-31fd19575a2d", // layout sketches on paper
  ],
  manga: [
    "1544947950-fa07a98d237f", // paperback on a table
    "1572044162444-ad60f128bdea", // illustrator at work
    "1522542550221-31fd19575a2d", // panel layout sketches
    "1518709268805-4e9042af9f23", // atmospheric landscape
    "1635322966219-b75ed372eb01", // deer at dusk, painterly
  ],
  cosplay: [
    "1578632767115-351597cf2477", // costumed character portrait
    "1620712943543-bcc4688e7485", // articulated figure, armour study
    "1572044162444-ad60f128bdea", // craft desk, tools and swatches
    "1534430480872-3498386e7856", // convention city skyline
    "1607604276583-eef5d076aa5f", // prints and reference laid out
  ],
} as const;

/** Wide, atmospheric shots used behind event listings. */
export const EVENT_IMAGES = [
  "1534430480872-3498386e7856", // city skyline
  "1516450360452-9312f5e86fc7", // arena crowd
  "1536440136628-849c177e76a1", // cinema frontage
  "1612036782180-6f0b6cd846fe", // comics haul
  "1542751371-adc38448a05e", // esports floor
  "1499364615650-ec38552f4f34", // stage rig
];

/**
 * Picks by position within the channel's pool rather than by hashing the slug.
 *
 * Hashing looked tidier but collided often enough that the same photograph
 * appeared two or three times in a single channel listing. Cycling by index
 * guarantees the pool is exhausted before anything repeats, and it stays
 * deterministic — the same record always resolves to the same photograph
 * across reseeds.
 */
export function pickStock(
  category: keyof typeof STOCK,
  index: number,
  offset = 0,
): string {
  const pool = STOCK[category] ?? STOCK.anime;
  return stock(pool[(index + offset) % pool.length]);
}
