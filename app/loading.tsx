import { CATEGORIES } from "@/lib/constants";

/**
 * Route loading state, staged as a press run: the eight inks roll on one
 * after another (SRS FR-12 — loading indicators on media-heavy pages).
 */
export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-5">
      <div className="w-full max-w-sm">
        <p className="mark mb-4">Printing</p>
        <div className="flex h-10 gap-1" role="status" aria-label="Loading">
          {CATEGORIES.map((category, index) => (
            <span
              key={category.slug}
              className="block flex-1 origin-left motion-safe:animate-[ink-roll_1.4s_ease-in-out_infinite]"
              style={{
                background: `var(--ch-${category.token})`,
                animationDelay: `${index * 110}ms`,
              }}
            />
          ))}
        </div>
        <div className="mt-3 border-t border-[var(--rule)] pt-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
          Eight passes
        </div>
      </div>
    </div>
  );
}
