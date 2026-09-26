import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Eye, Info } from "lucide-react";

import { categoryBySlug } from "@/lib/constants";
import { getMerchBySlug, getRelatedMerch, incrementMerchViews } from "@/lib/showcase";
import { getBookmarkedIds, isBookmarked } from "@/app/actions/bookmarks";
import { getCurrentUser } from "@/lib/dal";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Gallery } from "@/components/merch/gallery";
import { MerchCard } from "@/components/merch/merch-card";
import { BookmarkButton } from "@/components/bookmark-button";
import { ShareButton } from "@/components/share-button";
import { Reveal } from "@/components/motion/reveal";
import { Sticker } from "@/components/press";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/merch/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const item = await getMerchBySlug(slug);
  if (!item) return { title: "Item not found" };
  return {
    title: item.name,
    description: item.description.slice(0, 160),
    openGraph: { images: item.imageUrl ? [item.imageUrl] : undefined },
  };
}

export default async function MerchDetailPage(props: PageProps<"/merch/[slug]">) {
  const { slug } = await props.params;
  const item = await getMerchBySlug(slug);
  if (!item) notFound();

  const category = categoryBySlug(item.category);
  const ink = `var(--ch-${category?.token ?? "anime"})`;

  const [related, user, clipped] = await Promise.all([
    getRelatedMerch(item.category, slug),
    getCurrentUser(),
    isBookmarked("merchandise", item.id),
  ]);

  const relatedClipped = await getBookmarkedIds(
    "merchandise",
    related.map((entry) => entry.id),
  );

  // Popularity tracking (SRS FR-7, optional). Never awaited on the render path.
  void incrementMerchViews(slug);

  // The main plate first, then any additional gallery shots.
  const plates = [item.imageUrl, ...item.gallery].filter(Boolean);

  return (
    <div className="mx-auto max-w-[88rem] px-5 py-10 sm:px-8">
      <Breadcrumbs
        trail={[
          { href: "/merch", label: "Merch" },
          { href: `/merch?category=${item.category}`, label: category?.name ?? item.category },
          { label: item.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start">
        <Gallery images={plates} alt={item.name} ink={ink} />

        <div className="border-t-2 border-[var(--ink)] pt-5">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Sticker ink={ink}>{item.tag}</Sticker>
            {item.isUpcoming && <Sticker ink="var(--ink)">Upcoming</Sticker>}
          </div>

          <p className="mark mb-3">
            <span style={{ color: ink }}>{category?.name}</span> · Catalogue plate
          </p>

          <h1 className="font-display text-[clamp(2rem,5vw,3.4rem)] uppercase leading-[0.92]">
            {item.name}
          </h1>

          <p className="mt-5 text-[1.05rem] leading-relaxed text-[var(--ink-soft)]">
            {item.description}
          </p>

          <dl className="mt-7 grid grid-cols-2 gap-px border-[1.5px] border-[var(--ink)] bg-[var(--ink)]">
            <div className="bg-[var(--paper)] p-4">
              <dt className="mark !text-[0.58rem]">
                {item.isUpcoming ? "Expected" : "Released"}
              </dt>
              <dd className="mt-1.5 flex items-center gap-2 font-display text-[1.25rem] uppercase leading-none">
                <Calendar className="h-4 w-4 text-[var(--ink-faint)]" aria-hidden />
                {item.releaseDate ? formatDate(item.releaseDate) : "TBC"}
              </dd>
            </div>
            <div className="bg-[var(--paper)] p-4">
              <dt className="mark !text-[0.58rem]">Views</dt>
              <dd className="mt-1.5 flex items-center gap-2 font-display text-[1.25rem] uppercase leading-none tabular-nums">
                <Eye className="h-4 w-4 text-[var(--ink-faint)]" aria-hidden />
                {item.viewCount.toLocaleString()}
              </dd>
            </div>
          </dl>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <BookmarkButton
              targetType="merchandise"
              targetId={item.id}
              initialBookmarked={clipped}
              signedIn={Boolean(user)}
            />
            <ShareButton title={item.name} />
          </div>

          <div className="mt-7 flex items-start gap-3 border-[1.5px] border-[var(--rule-strong)] bg-[var(--paper-2)] p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ink-faint)]" aria-hidden />
            <p className="text-[0.86rem] leading-relaxed text-[var(--ink-soft)]">
              Showcase listing. There is no purchase, order or payment path anywhere in Fan Hub
              Plus — this page exists so you can find the thing, not buy it.
            </p>
          </div>

          <Link
            href={`/category/${item.category}`}
            className="mt-7 inline-block font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--spot-deep)] underline underline-offset-4"
          >
            More from {category?.name} →
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 border-t-2 border-[var(--ink)] pt-6">
          <h2 className="mb-6 font-display text-[1.9rem] uppercase leading-none">
            Also in {category?.name}
          </h2>
          <Reveal stagger={0.05} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((entry, index) => (
              <MerchCard
                key={entry.id}
                item={entry}
                index={index}
                bookmarked={relatedClipped.has(entry.id)}
                signedIn={Boolean(user)}
              />
            ))}
          </Reveal>
        </section>
      )}
    </div>
  );
}
