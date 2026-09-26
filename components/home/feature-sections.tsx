import Link from "next/link";
import { Search, Bookmark, MapPin, PlayCircle, Sparkles, ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { PressHeading, Misreg, Sticker } from "@/components/press";

const CAPABILITIES = [
  {
    icon: Search,
    title: "Search that narrows",
    body: "Channel, genre, release year and format at once, then sorted by newest, most read, or A–Z.",
    href: "/explore",
  },
  {
    icon: PlayCircle,
    title: "Everything plays here",
    body: "Trailers, breakdowns, timelapses, podcasts and soundtracks stream in place. Rate what you watch.",
    href: "/media",
  },
  {
    icon: Bookmark,
    title: "Clip and annotate",
    body: "Save any piece, character, reel or item, attach a private note, and find it again from your desk.",
    href: "/bookmarks",
  },
  {
    icon: MapPin,
    title: "Conventions near you",
    body: "Meetups, screenings and cons on a map, or the calendar filtered by city with links to tickets.",
    href: "/events",
  },
  {
    icon: Sparkles,
    title: "Your own edition",
    body: "Pick your channels once. The dashboard leads with them, next to everything you've clipped.",
    href: "/dashboard",
  },
  {
    icon: ShieldCheck,
    title: "Showcase, never checkout",
    body: "Merch is here to find, not to buy. No cart, no payment, no order tracking — by design.",
    href: "/merch",
  },
];

export function FeatureSections() {
  return (
    <>
      <section className="border-y-2 border-[var(--ink)] bg-[var(--paper-2)]">
        <div className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8">
          <PressHeading mark="What's in it" title="How it works" ghostInk="var(--ch-gaming)" />

          {/* A ruled table of contents, not a grid of rounded feature cards. */}
          <Reveal stagger={0.06} className="grid border-t border-[var(--ink)] sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((capability, index) => (
              <Link
                key={capability.title}
                href={capability.href}
                className="reveal group flex flex-col border-b border-r border-[var(--rule)] p-6 transition-colors hover:bg-[var(--paper)] last:border-r-0"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[0.62rem] tabular-nums text-[var(--ink-faint)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <capability.icon
                    className="h-4 w-4 text-[var(--spot)] transition-transform duration-200 group-hover:scale-125"
                    aria-hidden
                  />
                </div>
                <h3 className="mt-4 font-display text-[1.6rem] uppercase leading-[0.95]">
                  {capability.title}
                </h3>
                <p className="mt-2.5 text-[0.94rem] leading-snug text-[var(--ink-soft)]">
                  {capability.body}
                </p>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Back-cover call to action */}
      <section className="relative overflow-hidden border-b-2 border-[var(--ink)]">
        <div
          aria-hidden
          className="halftone pointer-events-none absolute inset-0 text-[var(--spot)] opacity-[0.22]"
        />
        <div className="relative mx-auto max-w-[88rem] px-5 py-20 text-center sm:px-8">
          <Sticker ink="var(--ink)">Subscription free</Sticker>
          <Misreg
            as="h2"
            ghostInk="var(--spot-2)"
            className="mt-6 text-[clamp(2.6rem,9vw,6.5rem)]"
          >
            Take a copy
          </Misreg>
          <p className="mx-auto mt-6 max-w-lg text-[1.06rem] leading-relaxed text-[var(--ink-soft)]">
            Make an account to clip pieces, rate what you watch, follow your channels, and get a
            front page that opens on the things you actually care about.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/register">Create an account</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/explore">Read as a visitor</Link>
            </Button>
          </div>

          {/* SRS §1.9 asks for the sitemap to be reachable from the home page. */}
          <Link
            href="/sitemap-page"
            className="mt-8 inline-block font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--ink-soft)] underline underline-offset-4 transition-colors hover:text-[var(--spot-deep)]"
          >
            See the full sitemap →
          </Link>
        </div>
      </section>
    </>
  );
}
