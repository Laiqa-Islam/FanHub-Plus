import Link from "next/link";
import Image from "next/image";

import { categoryBySlug } from "@/lib/constants";
import { formatDate, cn } from "@/lib/utils";
import { BookmarkButton } from "@/components/bookmark-button";
import { Duotone } from "@/components/duotone";
import type { MerchItem } from "@/lib/showcase";

/** A showcase entry, printed as a catalogue plate. */
export function MerchCard({
  item,
  bookmarked,
  signedIn,
  index = 0,
  className,
}: {
  item: MerchItem;
  bookmarked: boolean;
  signedIn: boolean;
  index?: number;
  className?: string;
}) {
  const category = categoryBySlug(item.category);
  const ink = `var(--ch-${category?.token ?? "anime"})`;

  return (
    <article className={cn("reveal group relative", className)}>
      <Link
        href={`/merch/${item.slug}`}
        className="flex h-full flex-col border-[1.5px] border-[var(--ink)] bg-[var(--paper)] transition-[transform,box-shadow] duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--ink)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden border-b-[1.5px] border-[var(--ink)] bg-[var(--paper-2)]">
          {item.imageUrl && (
            <Image
              src={item.imageUrl}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="plate object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <Duotone ink={ink} />

          <span
            className="absolute left-0 top-0 border-b-[1.5px] border-r-[1.5px] border-[var(--ink)] bg-[var(--paper)] px-2.5 py-1 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.14em]"
            style={{ color: ink }}
          >
            {item.tag}
          </span>

          {item.isUpcoming && (
            <span className="absolute bottom-0 left-0 border-r-[1.5px] border-t-[1.5px] border-[var(--ink)] bg-[var(--spot)] px-2.5 py-1 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white">
              Upcoming
            </span>
          )}

          <span className="absolute bottom-0 right-0 border-l-[1.5px] border-t-[1.5px] border-[var(--ink)] bg-[var(--paper)] px-2 py-0.5 font-mono text-[0.58rem] tabular-nums text-[var(--ink-faint)]">
            {String(index + 1).padStart(3, "0")}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="mark mb-2 !text-[0.58rem]">
            <span style={{ color: ink }}>{category?.name}</span>
            {item.releaseDate && (
              <> · {item.isUpcoming ? "expected" : "out"} {formatDate(item.releaseDate)}</>
            )}
          </p>
          <h3 className="font-display text-[1.35rem] uppercase leading-[0.95] group-hover:text-[var(--spot-deep)]">
            {item.name}
          </h3>
          <p className="mt-2 line-clamp-3 text-[0.88rem] leading-snug text-[var(--ink-soft)]">
            {item.description}
          </p>
          <p className="mt-auto pt-3 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
            {item.viewCount.toLocaleString()} views
          </p>
        </div>
      </Link>

      {/* Sits above the link so clipping never navigates. */}
      <BookmarkButton
        targetType="merchandise"
        targetId={item.id}
        initialBookmarked={bookmarked}
        signedIn={signedIn}
        variant="icon"
        className="absolute right-2 top-2 z-10"
      />
    </article>
  );
}
