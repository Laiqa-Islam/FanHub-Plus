import type { Metadata } from "next";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

import { CATEGORIES, CATEGORY_SLUGS } from "@/lib/constants";
import { getEvents, getEventCities } from "@/lib/events-query";
import { getBookmarkedIds } from "@/app/actions/bookmarks";
import { getCurrentUser } from "@/lib/dal";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { InkStrip, Misreg, RegMark } from "@/components/press";
import { EventExplorer } from "@/components/events/event-explorer";
import { HighlightReel } from "@/components/events/highlight-reel";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Events & calendar",
  description:
    "Find conventions, meetups, screenings and premieres near you on the map, or browse the calendar by city with links to tickets.",
};

export const dynamic = "force-dynamic";

/** Midnight today, so an event happening later on is still "ahead". */
function today() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

export default async function EventsPage(props: PageProps<"/events">) {
  const startOfToday = today();
  const params = await props.searchParams;
  const raw = Array.isArray(params.category)
    ? params.category[0]
    : params.category;
  const activeCategory = CATEGORY_SLUGS.includes(raw as never) ? raw! : "";

  const [events, cities, user] = await Promise.all([
    getEvents({ category: activeCategory }),
    getEventCities(),
    getCurrentUser(),
  ]);

  const clipped = await getBookmarkedIds(
    "event",
    events.map((event) => event.id),
  );

  // The reel leads the page, so it only carries what is still ahead — a
  // highlight that has already happened is a listing, not a highlight. It
  // follows the channel filter, so narrowing to K-Pop narrows the reel too.
  const highlights = events
    .filter(
      (event) => event.isHighlight && new Date(event.startsAt) >= startOfToday,
    )
    .slice(0, 6);

  return (
    <div>
      <header className="border-b border-[var(--rule-strong)]">
        <div className="mx-auto max-w-[88rem] px-5 pb-10 pt-8 sm:px-8">
          <Breadcrumbs trail={[{ label: "Events" }]} />

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mark mb-3">Listings · {events.length} scheduled</p>
              <Misreg
                as="h1"
                className="text-[clamp(1.85rem,5.5vw,3.6rem)]"
                ghostInk="var(--ch-tv)"
              >
                Where to go
              </Misreg>
              <p className="mt-5 max-w-xl border-l-2 border-[var(--ch-tv)] pl-5 text-[1.03rem] leading-relaxed text-[var(--ink-soft)]">
                Conventions, meetups, screenings and premieres. Share your
                location to sort by distance, search any city, or browse the
                whole calendar.
              </p>
            </div>
            <RegMark className="hidden text-[var(--ink-faint)] sm:block" />
          </div>

          <div className="mt-8 flex flex-wrap">
            <Chip
              href="/events"
              active={!activeCategory}
              label="All channels"
            />
            {CATEGORIES.map((category) => (
              <Chip
                key={category.slug}
                href={`/events?category=${category.slug}`}
                active={activeCategory === category.slug}
                label={category.name}
                ink={`var(--ch-${category.token})`}
              />
            ))}
          </div>
        </div>
        <InkStrip height={5} />
      </header>

      <HighlightReel events={highlights} />

      <div className="mx-auto max-w-[88rem] px-5 py-10 sm:px-8">
        <EventExplorer
          events={events}
          cities={cities}
          clippedIds={[...clipped]}
          signedIn={Boolean(user)}
        />

        <p className="mt-8 border-t border-[var(--rule)] pt-4 font-mono text-[0.62rem] leading-relaxed text-[var(--ink-faint)]">
          Map data and place search © OpenStreetMap contributors. Your location
          is read in the browser to sort this list — it is never sent to our
          servers or stored.
        </p>
      </div>
    </div>
  );
}

function Chip({
  href,
  active,
  label,
  ink,
}: {
  href: string;
  active: boolean;
  label: string;
  ink?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "-ml-[1.5px] inline-flex items-center gap-2 rounded-2xl border border-[var(--edge)] px-4 py-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors first:ml-0",
        active
          ? "bg-[var(--n1)] text-[var(--void)]"
          : "bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--paper-2)]",
      )}
    >
      {ink && (
        <span aria-hidden className="h-2.5 w-2.5" style={{ background: ink }} />
      )}
      {label}
    </Link>
  );
}
