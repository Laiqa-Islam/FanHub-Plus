import type { Metadata } from "next";
import Link from "next/link";
import { Scissors } from "lucide-react";

import { requireUser } from "@/lib/dal";
import { getClippings, getClippingCounts } from "@/lib/bookmarks-query";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { InkStrip, Misreg } from "@/components/press";
import { ClippingRow } from "@/components/bookmarks/clipping-row";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Your clippings" };
export const dynamic = "force-dynamic";

const TABS = [
  { value: "", label: "Everything", key: "all" },
  { value: "content", label: "Pieces", key: "content" },
  { value: "character", label: "Characters", key: "character" },
  { value: "merchandise", label: "Merch", key: "merchandise" },
  { value: "event", label: "Events", key: "event" },
] as const;

export default async function BookmarksPage(props: PageProps<"/bookmarks">) {
  const user = await requireUser();
  const params = await props.searchParams;
  const raw = Array.isArray(params.type) ? params.type[0] : params.type;
  const activeType = ["content", "character", "merchandise", "event"].includes(raw ?? "")
    ? raw!
    : "";

  const [rows, counts] = await Promise.all([
    getClippings(user.id, activeType),
    getClippingCounts(user.id),
  ]);

  return (
    <div>
      <header className="border-b-2 border-[var(--ink)]">
        <div className="mx-auto max-w-4xl px-5 pb-8 pt-8">
          <Breadcrumbs
            trail={[{ href: "/dashboard", label: "Dashboard" }, { label: "Clippings" }]}
          />

          <p className="mark mb-3">Your file · {counts.all ?? 0} saved</p>
          <Misreg as="h1" className="text-[clamp(2.4rem,7vw,4.4rem)]" ghostInk="var(--spot-2)">
            Clippings
          </Misreg>
          <p className="mt-5 max-w-lg border-l-4 border-[var(--spot)] pl-5 text-[1.02rem] leading-relaxed text-[var(--ink-soft)]">
            Everything you&apos;ve cut out and kept, with your own notes attached. Only you can
            see the notes.
          </p>

          <nav className="mt-8 flex flex-wrap" aria-label="Clipping types">
            {TABS.map((tab) => {
              const count = counts[tab.key] ?? 0;
              const active = activeType === tab.value;
              return (
                <Link
                  key={tab.label}
                  href={tab.value ? `/bookmarks?type=${tab.value}` : "/bookmarks"}
                  className={cn(
                    "-ml-[1.5px] inline-flex items-center gap-2 border-[1.5px] border-[var(--ink)] px-4 py-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors first:ml-0",
                    active
                      ? "bg-[var(--ink)] text-[var(--paper)]"
                      : "bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--paper-2)]",
                  )}
                >
                  {tab.label}
                  <span className="tabular-nums opacity-70">{count}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <InkStrip height={5} />
      </header>

      <div className="mx-auto max-w-4xl px-5 py-10">
        {rows.length === 0 ? (
          <div className="border-[1.5px] border-dashed border-[var(--rule-strong)] px-6 py-20 text-center">
            <Scissors className="mx-auto h-8 w-8 text-[var(--ink-faint)]" aria-hidden />
            <p className="mt-5 font-display text-[1.8rem] uppercase leading-none">
              Nothing clipped yet
            </p>
            <p className="mx-auto mt-3 max-w-sm text-[0.95rem] leading-relaxed text-[var(--ink-soft)]">
              Hit the scissors on any piece, character, reel or catalogue plate and it lands
              here — with room for a note about why you kept it.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/explore">Browse the issue</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/media">Watch something</Link>
              </Button>
            </div>
          </div>
        ) : (
          <ul className="flex flex-col border-t-2 border-[var(--ink)]">
            {rows.map((row) => (
              <ClippingRow key={row.bookmarkId} row={row} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
