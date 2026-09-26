import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { categoryBySlug } from "@/lib/constants";
import { Reveal } from "@/components/motion/reveal";
import { PressHeading } from "@/components/press";
import { ContentCard } from "@/components/content-card";
import { Duotone } from "@/components/duotone";
import { formatDate } from "@/lib/utils";
import type { ContentListItem } from "@/lib/queries";

/**
 * The feature spread: one lead piece set large, the rest as clippings.
 *
 * A uniform grid of equal cards gives every piece the same weight and reads
 * as a template. A magazine ranks its contents — the lead gets the page, and
 * everything else is sized accordingly.
 */
export function FeatureSpread({
  lead,
  secondary,
  rest,
}: {
  lead: ContentListItem | null;
  secondary: ContentListItem[];
  rest: ContentListItem[];
}) {
  if (!lead) return null;

  const leadCategory = categoryBySlug(lead.category);
  const leadInk = `var(--ch-${leadCategory?.token ?? "anime"})`;

  return (
    <section className="mx-auto max-w-[88rem] px-5 py-16 sm:px-8">
      <PressHeading
        mark="The feature"
        title="This issue"
        ghostInk="var(--spot-2)"
        action={
          <Link
            href="/explore"
            className="group inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[var(--ink-soft)] transition-colors hover:text-[var(--spot-deep)]"
          >
            Full contents
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        {/* Lead. It needs its own Reveal scope: `.reveal` starts hidden in
            CSS, so an element carrying that class outside a Reveal container
            has nothing to animate it in and stays invisible for good. */}
        <Reveal className="group">
          <article className="reveal">
            <Link href={`/content/${lead.slug}`} className="block">
            <div className="relative aspect-[16/9] overflow-hidden border-[1.5px] border-[var(--ink)] bg-[var(--paper-2)]">
              {lead.coverImage && (
                <Image
                  src={lead.coverImage}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="plate object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <Duotone ink={leadInk} strength={0.66} />

              <span
                className="absolute left-0 top-0 border-b-[1.5px] border-r-[1.5px] border-[var(--ink)] bg-[var(--paper)] px-3 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em]"
                style={{ color: leadInk }}
              >
                Lead · {leadCategory?.name}
              </span>
            </div>

            <h3 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.2rem)] uppercase leading-[0.9] transition-colors group-hover:text-[var(--spot-deep)]">
              {lead.title}
            </h3>

            <p className="mt-4 max-w-2xl text-[1.08rem] leading-relaxed text-[var(--ink-soft)]">
              {lead.summary}
            </p>

            <p className="mt-4 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
              {formatDate(lead.releaseDate)} · {lead.viewCount.toLocaleString()} reads
              {lead.ratingCount > 0 && ` · ${lead.averageRating.toFixed(1)}★`}
            </p>
            </Link>
          </article>
        </Reveal>

        {/* Secondary column — a contents list, not more cards */}
        <div className="border-t-2 border-[var(--ink)] pt-4">
          <p className="mark mb-4">Also inside</p>
          <Reveal stagger={0.06} className="flex flex-col">
            {secondary.map((item, index) => {
              const category = categoryBySlug(item.category);
              return (
                <Link
                  key={item.id}
                  href={`/content/${item.slug}`}
                  className="reveal group border-b border-[var(--rule)] py-3.5 transition-colors hover:bg-[var(--paper-2)]"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[0.62rem] tabular-nums text-[var(--ink-faint)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 shrink-0 translate-y-[-1px]"
                      style={{ background: `var(--ch-${category?.token ?? "anime"})` }}
                    />
                    <span className="min-w-0">
                      <span className="block font-display text-[1.3rem] uppercase leading-[0.95] transition-transform duration-200 group-hover:translate-x-1">
                        {item.title}
                      </span>
                      <span className="mt-1 block font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                        {category?.name} · {item.type}
                      </span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </Reveal>
        </div>
      </div>

      {/* Clippings */}
      {rest.length > 0 && (
        <Reveal stagger={0.05} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((item, index) => (
            <ContentCard key={item.id} item={item} index={index} />
          ))}
        </Reveal>
      )}
    </section>
  );
}
