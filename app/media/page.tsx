import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Play, Headphones, ImageIcon, Clock } from "lucide-react";

import { categoryBySlug } from "@/lib/constants";
import { getMediaLibrary } from "@/lib/queries";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Reveal } from "@/components/motion/reveal";
import { InkStrip, Misreg, RegMark } from "@/components/press";
import { VideoPlayer } from "@/components/media/video-player";
import { mediaSrc } from "@/lib/media";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Multimedia Center",
  description:
    "Trailers, breakdowns, timelapses, podcasts and soundtracks from every fandom channel, streaming in one place.",
};

export const dynamic = "force-dynamic";

const TABS = [
  { value: "", label: "Everything", icon: null },
  { value: "video", label: "Watch", icon: Play },
  { value: "audio", label: "Listen", icon: Headphones },
  { value: "image", label: "Galleries", icon: ImageIcon },
] as const;

export default async function MediaPage(props: PageProps<"/media">) {
  const params = await props.searchParams;
  const rawType = Array.isArray(params.type) ? params.type[0] : params.type;
  const activeType = ["video", "audio", "image"].includes(rawType ?? "") ? rawType! : "";

  const items = await getMediaLibrary(activeType);

  // The strongest video leads the page as a featured reel.
  const featured = items.find((item) => item.type === "video" && item.mediaUrl);
  const rest = items.filter((item) => item.id !== featured?.id);
  const featuredInk = `var(--ch-${categoryBySlug(featured?.category ?? "anime")?.token ?? "anime"})`;

  return (
    <div>
      <header className="border-b-2 border-[var(--ink)]">
        <div className="mx-auto max-w-[88rem] px-5 pb-10 pt-8 sm:px-8">
          <Breadcrumbs trail={[{ label: "Multimedia" }]} />

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mark mb-3">Section · {items.length} pieces</p>
              <Misreg as="h1" className="text-[clamp(2.6rem,8vw,5.5rem)]" ghostInk="var(--spot-2)">
                Multimedia
              </Misreg>
              <p className="mt-5 max-w-xl border-l-4 border-[var(--spot-2)] pl-5 text-[1.05rem] leading-relaxed text-[var(--ink-soft)]">
                Trailers, craft breakdowns, build timelapses, podcasts and soundtracks. Rate
                anything you watch — the scores drive what surfaces across the site.
              </p>
            </div>
            <RegMark className="hidden text-[var(--ink-faint)] sm:block" />
          </div>

          {/* Format tabs */}
          <nav className="mt-9 flex flex-wrap gap-0" aria-label="Media formats">
            {TABS.map((tab) => {
              const active = activeType === tab.value;
              return (
                <Link
                  key={tab.label}
                  href={tab.value ? `/media?type=${tab.value}` : "/media"}
                  className={cn(
                    "inline-flex items-center gap-2 border-[1.5px] border-[var(--ink)] px-5 py-2.5 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.15em] transition-colors -ml-[1.5px] first:ml-0",
                    active
                      ? "bg-[var(--ink)] text-[var(--paper)]"
                      : "bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--paper-2)]",
                  )}
                >
                  {tab.icon && <tab.icon className="h-3.5 w-3.5" aria-hidden />}
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <InkStrip height={6} />
      </header>

      <div className="mx-auto max-w-[88rem] px-5 py-12 sm:px-8">
        {/* Featured reel */}
        {featured && (
          <section className="mb-16 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
            <VideoPlayer
              src={mediaSrc(featured.mediaUrl)}
              poster={featured.mediaPoster || featured.coverImage}
              title={featured.title}
              ink={featuredInk}
            />

            <div className="border-t-2 border-[var(--ink)] pt-4">
              <p className="mark mb-3">Now showing</p>
              <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] uppercase leading-[0.95]">
                {featured.title}
              </h2>
              <p className="mt-4 text-[1rem] leading-relaxed text-[var(--ink-soft)]">
                {featured.summary}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {featured.mediaTags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-[var(--ink)] px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {featured.mediaCredit && (
                <p className="mt-5 border-t border-[var(--rule)] pt-3 font-mono text-[0.62rem] leading-relaxed text-[var(--ink-faint)]">
                  {featured.mediaCredit}
                </p>
              )}

              <Link
                href={`/content/${featured.slug}`}
                className="mt-5 inline-block font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--spot-deep)] underline underline-offset-4"
              >
                Read the full piece →
              </Link>
            </div>
          </section>
        )}

        {/* Listing */}
        {rest.length === 0 ? (
          <p className="border-[1.5px] border-dashed border-[var(--rule-strong)] px-6 py-16 text-center text-[var(--ink-soft)]">
            Nothing in this format yet.
          </p>
        ) : (
          <Reveal stagger={0.04} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((item, index) => {
              const category = categoryBySlug(item.category);
              const ink = `var(--ch-${category?.token ?? "anime"})`;
              const Icon =
                item.type === "video" ? Play : item.type === "audio" ? Headphones : ImageIcon;

              return (
                <Link
                  key={item.id}
                  href={`/content/${item.slug}`}
                  className="reveal group flex flex-col border-[1.5px] border-[var(--ink)] bg-[var(--paper)] transition-[transform,box-shadow] duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--ink)]"
                >
                  <div className="relative aspect-video overflow-hidden border-b-[1.5px] border-[var(--ink)] bg-[#0c0b10]">
                    {(item.mediaPoster || item.coverImage) && (
                      <Image
                        src={item.mediaPoster || item.coverImage}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="plate object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <span
                      aria-hidden
                      className="absolute inset-0 opacity-70 mix-blend-multiply"
                      style={{ background: ink }}
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-[0.16]"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(to bottom, transparent 0 2px, rgba(255,255,255,.8) 2px 3px)",
                      }}
                    />

                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid h-14 w-14 place-items-center border-[1.5px] border-white bg-black/45 text-white transition-transform duration-200 group-hover:scale-110">
                        <Icon className="h-5 w-5 fill-current" aria-hidden />
                      </span>
                    </span>

                    {item.mediaRuntime && (
                      <span className="absolute bottom-0 right-0 border-l-[1.5px] border-t-[1.5px] border-[var(--ink)] bg-[var(--paper)] px-2 py-0.5 font-mono text-[0.6rem] tabular-nums">
                        <Clock className="mr-1 inline h-2.5 w-2.5" aria-hidden />
                        {item.mediaRuntime}
                      </span>
                    )}

                    <span className="absolute left-0 top-0 border-b-[1.5px] border-r-[1.5px] border-[var(--ink)] bg-[var(--paper)] px-2 py-0.5 font-mono text-[0.58rem] tabular-nums text-[var(--ink-faint)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <p className="mark mb-2 !text-[0.58rem]" style={{ color: ink }}>
                      {category?.name} · {item.type}
                    </p>
                    <h3 className="font-display text-[1.35rem] uppercase leading-[0.95] group-hover:text-[var(--spot-deep)]">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[0.88rem] leading-snug text-[var(--ink-soft)]">
                      {item.summary}
                    </p>
                    {item.ratingCount > 0 && (
                      <p className="mt-auto pt-3 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                        {item.averageRating.toFixed(1)}★ · {item.ratingCount} ratings
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </Reveal>
        )}
      </div>
    </div>
  );
}
