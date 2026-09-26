import type { Metadata } from "next";
import Link from "next/link";
import { Info } from "lucide-react";

import { CATEGORIES, CATEGORY_SLUGS, MERCH_TAGS } from "@/lib/constants";
import { getMerch } from "@/lib/showcase";
import { getBookmarkedIds } from "@/app/actions/bookmarks";
import { getCurrentUser } from "@/lib/dal";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Reveal } from "@/components/motion/reveal";
import { InkStrip, Misreg, RegMark } from "@/components/press";
import { MerchCard } from "@/components/merch/merch-card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Merchandise showcase",
  description:
    "Figures, art books, prints and collectibles grouped by fandom. Display and discovery only — no purchasing.",
};

export const dynamic = "force-dynamic";

export default async function MerchPage(props: PageProps<"/merch">) {
  const params = await props.searchParams;
  const one = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const rawCategory = one("category");
  const activeCategory = CATEGORY_SLUGS.includes(rawCategory as never) ? rawCategory! : "";
  const rawTag = one("tag");
  const activeTag = (MERCH_TAGS as readonly string[]).includes(rawTag ?? "") ? rawTag! : "";
  const upcomingOnly = one("upcoming") === "1";

  const [items, user] = await Promise.all([
    getMerch({ category: activeCategory, tag: activeTag, upcomingOnly }),
    getCurrentUser(),
  ]);

  const clipped = await getBookmarkedIds(
    "merchandise",
    items.map((item) => item.id),
  );

  // The SRS asks for the showcase grouped by fandom, so with no filter applied
  // the listing is split into per-channel runs.
  const grouped = new Map<string, typeof items>();
  for (const item of items) {
    const bucket = grouped.get(item.category) ?? [];
    bucket.push(item);
    grouped.set(item.category, bucket);
  }
  const showGrouped = !activeCategory && !activeTag && !upcomingOnly;

  return (
    <div>
      <header className="border-b-2 border-[var(--ink)]">
        <div className="mx-auto max-w-[88rem] px-5 pb-10 pt-8 sm:px-8">
          <Breadcrumbs trail={[{ label: "Merch" }]} />

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mark mb-3">Catalogue · {items.length} plates</p>
              <Misreg
                as="h1"
                className="text-[clamp(2.4rem,8vw,5.2rem)]"
                ghostInk="var(--ch-movies)"
              >
                Merchandise
              </Misreg>
              <p className="mt-5 max-w-xl border-l-4 border-[var(--ch-movies)] pl-5 text-[1.03rem] leading-relaxed text-[var(--ink-soft)]">
                Figures, art books, prints and collectibles, grouped by fandom — plus
                what&apos;s arriving next.
              </p>
            </div>
            <RegMark className="hidden text-[var(--ink-faint)] sm:block" />
          </div>

          {/* Commerce is explicitly out of scope; say so rather than leaving
              readers hunting for a buy button. */}
          <div className="mt-8 flex items-start gap-3 border-[1.5px] border-[var(--ink)] bg-[var(--paper-2)] p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <p className="text-[0.9rem] leading-relaxed text-[var(--ink-soft)]">
              This is a showcase for discovery only. Fan Hub Plus has no cart, checkout or
              payment processing, and never asks for payment details.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <div className="flex flex-wrap">
              <Chip
                href="/merch"
                active={!activeCategory && !activeTag && !upcomingOnly}
                label="All"
              />
              <Chip href="/merch?upcoming=1" active={upcomingOnly} label="Upcoming" />
              {CATEGORIES.map((category) => (
                <Chip
                  key={category.slug}
                  href={`/merch?category=${category.slug}`}
                  active={activeCategory === category.slug}
                  label={category.name}
                  ink={`var(--ch-${category.token})`}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="mark mr-1 !text-[0.6rem]">Tag</span>
              {MERCH_TAGS.map((tag) => (
                <Link
                  key={tag}
                  href={activeTag === tag ? "/merch" : `/merch?tag=${encodeURIComponent(tag)}`}
                  className={cn(
                    "border-[1.5px] px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.13em] transition-colors",
                    activeTag === tag
                      ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                      : "border-[var(--rule-strong)] text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--ink)]",
                  )}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <InkStrip height={5} />
      </header>

      <div className="mx-auto max-w-[88rem] px-5 py-12 sm:px-8">
        {items.length === 0 ? (
          <p className="border-[1.5px] border-dashed border-[var(--rule-strong)] px-6 py-16 text-center text-[var(--ink-soft)]">
            Nothing in the showcase matches that filter yet.
          </p>
        ) : showGrouped ? (
          <div className="flex flex-col gap-16">
            {CATEGORIES.filter((category) => grouped.has(category.slug)).map((category) => {
              const bucket = grouped.get(category.slug)!;
              return (
                <section key={category.slug}>
                  <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-t-2 border-[var(--ink)] pt-3">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="h-6 w-6"
                        style={{ background: `var(--ch-${category.token})` }}
                      />
                      <h2 className="font-display text-[2rem] uppercase leading-none">
                        {category.name}
                      </h2>
                      <span className="mark !text-[0.6rem]">{bucket.length} plates</span>
                    </div>
                    <Link
                      href={`/merch?category=${category.slug}`}
                      className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[var(--ink-soft)] transition-colors hover:text-[var(--spot-deep)]"
                    >
                      See all →
                    </Link>
                  </div>

                  <Reveal stagger={0.05} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {bucket.slice(0, 4).map((item, index) => (
                      <MerchCard
                        key={item.id}
                        item={item}
                        index={index}
                        bookmarked={clipped.has(item.id)}
                        signedIn={Boolean(user)}
                      />
                    ))}
                  </Reveal>
                </section>
              );
            })}
          </div>
        ) : (
          <Reveal stagger={0.04} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
              <MerchCard
                key={item.id}
                item={item}
                index={index}
                bookmarked={clipped.has(item.id)}
                signedIn={Boolean(user)}
              />
            ))}
          </Reveal>
        )}

        <div className="mt-16 border-t-2 border-[var(--ink)] pt-6">
          <Link
            href="/upcoming"
            className="group inline-flex items-center gap-3 font-display text-[1.8rem] uppercase leading-none transition-colors hover:text-[var(--spot-deep)]"
          >
            See everything coming next
            <span className="transition-transform duration-200 group-hover:translate-x-2">→</span>
          </Link>
        </div>
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
        "-ml-[1.5px] inline-flex items-center gap-2 border-[1.5px] border-[var(--ink)] px-4 py-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors first:ml-0",
        active
          ? "bg-[var(--ink)] text-[var(--paper)]"
          : "bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--paper-2)]",
      )}
    >
      {ink && <span aria-hidden className="h-2.5 w-2.5" style={{ background: ink }} />}
      {label}
    </Link>
  );
}
