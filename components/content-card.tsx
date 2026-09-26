import Link from "next/link";
import Image from "next/image";
import { FileText, Play, Headphones, ImageIcon, Star } from "lucide-react";

import { categoryBySlug } from "@/lib/constants";
import { formatDate, cn } from "@/lib/utils";
import { Duotone } from "@/components/duotone";
import type { ContentListItem } from "@/lib/queries";

const TYPE_ICON = {
  article: FileText,
  video: Play,
  audio: Headphones,
  image: ImageIcon,
} as const;

/**
 * A clipping from the issue.
 *
 * Square corners, a hard ink rule, and a duotone image printed in the
 * channel's spot ink — the image is *part of* the print, not a photograph
 * dropped into a rounded card. On hover the whole clipping lifts off the page
 * into its own hard shadow.
 */
export function ContentCard({
  item,
  priority = false,
  index = 0,
  className,
}: {
  item: ContentListItem;
  priority?: boolean;
  index?: number;
  className?: string;
}) {
  const category = categoryBySlug(item.category);
  const Icon = TYPE_ICON[item.type as keyof typeof TYPE_ICON] ?? FileText;
  const ink = `var(--ch-${category?.token ?? "anime"})`;

  return (
    <article className={cn("reveal group", className)}>
      <Link
        href={`/content/${item.slug}`}
        className="flex h-full flex-col border-[1.5px] border-[var(--ink)] bg-[var(--paper)] transition-[transform,box-shadow] duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--ink)]"
      >
        <div className="relative aspect-[5/3] overflow-hidden border-b-[1.5px] border-[var(--ink)] bg-[var(--paper-2)]">
          {item.coverImage && (
            <Image
              src={item.coverImage}
              alt=""
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="plate object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}

          <Duotone ink={ink} />

          <span
            className="absolute left-0 top-0 inline-flex items-center gap-1.5 border-b-[1.5px] border-r-[1.5px] border-[var(--ink)] bg-[var(--paper)] px-2.5 py-1 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em]"
            style={{ color: ink }}
          >
            <Icon className="h-3 w-3" aria-hidden />
            {item.type}
          </span>

          <span className="absolute bottom-0 right-0 border-l-[1.5px] border-t-[1.5px] border-[var(--ink)] bg-[var(--paper)] px-2 py-0.5 font-mono text-[0.58rem] tabular-nums text-[var(--ink-faint)]">
            {String(index + 1).padStart(3, "0")}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="mark mb-2.5 !text-[0.6rem]">
            <span style={{ color: ink }}>{category?.name}</span>
            {item.releaseDate && <> · {formatDate(item.releaseDate)}</>}
          </p>

          <h3 className="font-display text-[1.5rem] uppercase leading-[0.95] transition-colors group-hover:text-[var(--spot-deep)]">
            {item.title}
          </h3>

          <p className="mt-2.5 line-clamp-3 text-[0.92rem] leading-snug text-[var(--ink-soft)]">
            {item.summary}
          </p>

          <div className="mt-auto flex items-center gap-3 border-t border-[var(--rule)] pt-3 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
            {item.ratingCount > 0 && (
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Star className="h-3 w-3 fill-current" style={{ color: ink }} aria-hidden />
                {item.averageRating.toFixed(1)}
              </span>
            )}
            <span className="tabular-nums">{item.viewCount.toLocaleString()} reads</span>
            {item.genre[0] && <span className="ml-auto truncate">{item.genre[0]}</span>}
          </div>
        </div>
      </Link>
    </article>
  );
}
