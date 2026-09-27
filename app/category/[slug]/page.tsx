import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowUpRight } from "lucide-react";

import { CATEGORIES, categoryBySlug } from "@/lib/constants";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContentCard } from "@/components/content-card";
import { Pagination } from "@/components/pagination";
import { FilterBar } from "@/components/explore/filter-bar";
import { Reveal } from "@/components/motion/reveal";
import { connectToDatabase } from "@/lib/db";
import { CharacterProfile } from "@/models";
import {
  parseFilters,
  searchContent,
  getFilterFacets,
  buildSearchParams,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

// Every channel is known at build time, so the routes can be enumerated.
export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata(
  props: PageProps<"/category/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const category = categoryBySlug(slug);
  if (!category) return { title: "Channel not found" };
  return { title: category.name, description: category.tagline };
}

export default async function CategoryPage(props: PageProps<"/category/[slug]">) {
  const { slug } = await props.params;
  const category = categoryBySlug(slug);
  if (!category) notFound();

  const searchParams = await props.searchParams;
  const filters = parseFilters({
    ...Object.fromEntries(
      Object.entries(searchParams).map(([key, value]) => [
        key,
        Array.isArray(value) ? value[0] : value,
      ]),
    ),
    // The channel is fixed by the route, so it overrides any param.
    category: slug,
  });

  await connectToDatabase();

  const [{ items, total, pageCount }, facets, characters] = await Promise.all([
    searchContent(filters),
    getFilterFacets(slug),
    // `category.slug` keeps the literal union type from CATEGORIES, which is
    // what Mongoose's typed filter wants — unlike the widened route param.
    CharacterProfile.find({ category: category.slug })
      .sort({ popularityScore: -1 })
      .limit(4)
      .lean(),
  ]);

  return (
    <div>
      {/* Channel masthead, washed in the channel's own hue */}
      <header className="relative overflow-hidden border-b border-[var(--rule)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16]"
          style={{
            background: `radial-gradient(70% 120% at 20% 0%, var(--ch-${category.token}), transparent 70%)`,
          }}
        />
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-10">
          <Breadcrumbs trail={[{ href: "/explore", label: "Channels" }, { label: category.name }]} />

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-10 w-1.5"
                  style={{ background: `var(--ch-${category.token})` }}
                />
                <p className="mark">Channel · {total} items</p>
              </div>
              <h1 className="font-display text-[clamp(1.75rem,4.5vw,2.8rem)]">{category.name}</h1>
              <p className="mt-4 text-[1.02rem] leading-relaxed text-[var(--ink-soft)]">
                {category.tagline}
              </p>
            </div>

            <nav className="flex flex-wrap gap-2" aria-label="Other channels">
              {CATEGORIES.filter((c) => c.slug !== slug)
                .slice(0, 4)
                .map((other) => (
                  <Link
                    key={other.slug}
                    href={`/category/${other.slug}`}
                    className="flex items-center gap-2 border border-[var(--rule-strong)] px-3.5 py-1.5 text-[0.8rem] text-[var(--ink-soft)] transition-colors hover:border-[var(--rule-strong)] hover:text-[var(--ink)]"
                  >
                    <span
                      aria-hidden
                      className="h-2 w-2 rounded-full"
                      style={{
                    background: `var(--ch-${other.token})`,
                    boxShadow: `0 0 9px var(--ch-${other.token})`,
                  }}
                    />
                    {other.name}
                  </Link>
                ))}
            </nav>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-12">
        <Suspense fallback={<div className="mb-10 h-32" />}>
          <FilterBar
            genres={facets.genres}
            years={facets.years}
            total={total}
            lockedCategory={slug}
          />
        </Suspense>

        {items.length === 0 ? (
          <p className="border border-dashed border-[var(--edge-strong)] px-6 py-16 text-center text-[var(--ink-soft)]">
            Nothing in this channel matches those filters yet.
          </p>
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
              hrefFor={(page) =>
                `/category/${slug}${buildSearchParams({ ...filters, category: "" }, { page })}`
              }
            />
          </>
        )}

        {/* Characters from this channel */}
        {characters.length > 0 && (
          <section className="mt-20 border-t border-[var(--rule)] pt-14">
            <div className="mb-7 flex items-center justify-between">
              <h2 className="font-display text-[1.5rem]">Characters in {category.name}</h2>
              <Link
                href={`/characters?category=${slug}`}
                className="group flex items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[0.13em] text-[var(--ink-soft)] transition-colors hover:text-[var(--spot)]"
              >
                All characters
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {characters.map((character) => (
                <Link
                  key={String(character._id)}
                  href={`/characters/${character.slug}`}
                  className="group border border-[var(--rule-strong)] bg-[var(--paper)] p-5 transition-colors hover:border-[var(--rule-strong)]"
                >
                  <p className="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                    {character.franchise}
                  </p>
                  <h3 className="mt-2 font-display text-[1.05rem] font-bold transition-colors group-hover:text-[var(--spot)]">
                    {character.name}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-[0.84rem] leading-relaxed text-[var(--ink-soft)]">
                    {character.bio}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
