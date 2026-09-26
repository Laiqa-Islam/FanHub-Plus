import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchX } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContentCard } from "@/components/content-card";
import { Pagination } from "@/components/pagination";
import { FilterBar } from "@/components/explore/filter-bar";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import {
  parseFilters,
  searchContent,
  getFilterFacets,
  buildSearchParams,
} from "@/lib/queries";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Search, filter and sort every article, video, audio piece and gallery across all eight fandom channels.",
};

export const dynamic = "force-dynamic";

export default async function ExplorePage(props: PageProps<"/explore">) {
  const params = await props.searchParams;
  const filters = parseFilters(
    Object.fromEntries(
      Object.entries(params).map(([key, value]) => [
        key,
        Array.isArray(value) ? value[0] : value,
      ]),
    ),
  );

  const [{ items, total, pageCount }, facets] = await Promise.all([
    searchContent(filters),
    getFilterFacets(filters.category || undefined),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <Breadcrumbs trail={[{ label: "Explore" }]} />

      <header className="mb-10 max-w-2xl">
        <p className="mark mb-3">Content explorer</p>
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)]">Everything, searchable</h1>
        <p className="mt-4 text-[1rem] leading-relaxed text-[var(--ink-soft)]">
          Filter by channel, format, genre and release year at once, then sort by what&apos;s
          newest, most popular, or alphabetical.
        </p>
      </header>

      {/* useSearchParams needs a Suspense boundary during prerender. */}
      <Suspense fallback={<div className="mb-10 h-32" />}>
        <FilterBar genres={facets.genres} years={facets.years} total={total} />
      </Suspense>

      {items.length === 0 ? (
        <EmptyResults />
      ) : (
        <>
          <Reveal stagger={0.04} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <ContentCard key={item.id} item={item} priority={index < 3} />
            ))}
          </Reveal>

          <Pagination
            page={filters.page}
            pageCount={pageCount}
            hrefFor={(page) => `/explore${buildSearchParams(filters, { page })}`}
          />
        </>
      )}
    </div>
  );
}

function EmptyResults() {
  return (
    <div className="border-[1.5px] border-dashed border-[var(--rule-strong)] px-6 py-20 text-center">
      <SearchX className="mx-auto h-8 w-8 text-[var(--ink-faint)]" aria-hidden />
      <h2 className="mt-5 font-display text-[1.4rem]">Nothing matches that combination</h2>
      <p className="mx-auto mt-3 max-w-sm text-[0.92rem] leading-relaxed text-[var(--ink-soft)]">
        Try removing a filter, or widen the search to a different channel.
      </p>
      <Button asChild variant="outline" className="mt-7">
        <a href="/explore">Reset filters</a>
      </Button>
    </div>
  );
}
