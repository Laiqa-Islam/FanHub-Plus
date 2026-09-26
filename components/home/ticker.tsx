import { CATEGORIES } from "@/lib/constants";

/**
 * The press feed — a strip of headlines running along the sheet like a paper
 * feeding through a roller. CSS marquee, paused on hover, frozen entirely for
 * reduced-motion readers. The list is doubled so the -50% translate loops.
 */
export function Ticker({ items }: { items: string[] }) {
  const track = [...items, ...items];

  return (
    <div className="feed relative overflow-hidden border-y-2 border-[var(--ink)] bg-[var(--ink)] py-2.5">
      <div className="feed-track">
        {track.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex shrink-0 items-center gap-3 px-5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--paper)]"
            aria-hidden={index >= items.length}
          >
            <span
              className="h-2.5 w-2.5 shrink-0"
              style={{
                background: `var(--ch-${CATEGORIES[index % CATEGORIES.length].token})`,
              }}
            />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
