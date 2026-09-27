import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Play, Headphones, ImageIcon, Clock } from "lucide-react";

import { categoryBySlug } from "@/lib/constants";
import { getMediaLibrary } from "@/lib/queries";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Reveal } from "@/components/motion/reveal";
import { InkStrip, RegMark } from "@/components/press";
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

/** The three signals, cycled across the format pills. */
const TAB_INKS = ["var(--n1)", "var(--n2)", "var(--n3)", "var(--ch-kpop)"];

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
      <header className="relative border-b border-[var(--rule)]">
        <div className="mx-auto max-w-[88rem] px-5 pb-10 pt-8 sm:px-8">
          <Breadcrumbs trail={[{ label: "Multimedia" }]} />

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mark mb-3 text-[var(--n1)]">
                Multimedia · {items.length} pieces
              </p>
              <h1 className="font-display text-[clamp(1.9rem,5.5vw,3.6rem)] font-black leading-[0.95]">
                Watch. Listen.
                <br />
                <span className="text-[var(--n2)] [--glow:var(--n2)] glow-text">Loop it.</span>
              </h1>
              <p className="mt-5 max-w-xl border-l-2 border-[var(--n2)] pl-5 text-[1.02rem] leading-relaxed text-[var(--ink-soft)]">
                Trailers, craft breakdowns, build timelapses, podcasts and soundtracks. Rate
                anything you watch — the scores drive what surfaces across the site.
              </p>
            </div>
            <RegMark className="hidden text-[var(--ink-faint)] sm:block" />
          </div>

          {/* Format tabs — lit pills, one signal each. */}
          <nav className="mt-9 flex flex-wrap gap-2" aria-label="Media formats">
            {TABS.map((tab, index) => {
              const active = activeType === tab.value;
              const tabInk = TAB_INKS[index % TAB_INKS.length];
              return (
                <Link
                  key={tab.label}
                  href={tab.value ? `/media?type=${tab.value}` : "/media"}
                  className={cn(
                    "inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.13em] transition-colors",
                    active
                      ? "text-[var(--void)]"
                      : "border-[var(--edge)] text-[var(--ink-soft)] hover:border-[var(--edge-strong)] hover:text-[var(--ink)]",
                  )}
                  style={
                    active
                      ? {
                          background: tabInk,
                          borderColor: tabInk,
                          boxShadow: `0 0 18px color-mix(in oklch, ${tabInk} 50%, transparent)`,
                        }
                      : undefined
                  }
                >
                  {tab.icon && <tab.icon className="h-3.5 w-3.5" aria-hidden />}
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <InkStrip height={2} className="absolute inset-x-0 bottom-0" />
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

            <div>
              <p className="mark mb-3 text-[var(--n3)]">Now showing</p>
              <h2 className="font-display text-[clamp(1.2rem,2.8vw,1.75rem)] font-bold leading-[1.05]">
                {featured.title}
              </h2>
              <p className="mt-4 text-[1rem] leading-relaxed text-[var(--ink-soft)]">
                {featured.summary}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {featured.mediaTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--edge)] px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[var(--ink-soft)]"
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
                className="mt-5 inline-block font-mono text-[0.64rem] uppercase tracking-[0.16em] text-[var(--n2)] underline underline-offset-4 transition-colors hover:text-[var(--n1)]"
              >
                Read the full piece →
              </Link>
            </div>
          </section>
        )}

        {/* Listing */}
        {rest.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--edge-strong)] px-6 py-16 text-center text-[var(--ink-soft)]">
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
                  className="reveal group relative flex flex-col overflow-hidden rounded-[1.25rem] border border-[var(--edge)] bg-[var(--paper-3)] transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-video overflow-hidden bg-[var(--void)]">
                    {(item.mediaPoster || item.coverImage) && (
                      <Image
                        src={item.mediaPoster || item.coverImage}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="plate object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <span
                      aria-hidden
                      className="absolute inset-0 opacity-45 mix-blend-soft-light"
                      style={{ background: ink }}
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-[0.12]"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(to bottom, transparent 0 2px, rgba(255,255,255,.8) 2px 3px)",
                      }}
                    />

                    {/* The play plate: a lit disc in the channel's own signal,
                        the way the mockup fronts its featured episode. */}
                    <span className="absolute inset-0 grid place-items-center">
                      <span
                        className="grid h-14 w-14 place-items-center rounded-full text-[var(--void)] transition-transform duration-200 group-hover:scale-110"
                        style={{
                          background: ink,
                          boxShadow: `0 0 28px color-mix(in oklch, ${ink} 60%, transparent)`,
                        }}
                      >
                        <Icon className="h-5 w-5 fill-current" aria-hidden />
                      </span>
                    </span>

                    {item.mediaRuntime && (
                      <span className="absolute bottom-2.5 right-2.5 rounded-full bg-[color-mix(in_oklch,var(--void)_75%,transparent)] px-2 py-0.5 font-mono text-[0.56rem] tabular-nums text-[var(--ink-soft)] backdrop-blur-sm">
                        <Clock className="mr-1 inline h-2.5 w-2.5" aria-hidden />
                        {item.mediaRuntime}
                      </span>
                    )}

                    <span className="absolute left-2.5 top-2.5 rounded-full bg-[color-mix(in_oklch,var(--void)_75%,transparent)] px-2 py-0.5 font-mono text-[0.56rem] tabular-nums text-[var(--ink-soft)] backdrop-blur-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <p className="mark mb-2 !text-[0.58rem]" style={{ color: ink }}>
                      {category?.name} · {item.type}
                    </p>
                    <h3 className="font-display text-[0.95rem] font-bold leading-[1.15] transition-colors group-hover:text-[var(--n2)]">
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

                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[1.25rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      border: `1px solid ${ink}`,
                      boxShadow: `0 0 26px color-mix(in oklch, ${ink} 32%, transparent)`,
                    }}
                  />
                </Link>
              );
            })}
          </Reveal>
        )}
      </div>
    </div>
  );
}
