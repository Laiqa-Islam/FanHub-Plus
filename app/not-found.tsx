import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-5">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-8 flex h-8 w-56 gap-1.5">
          {CATEGORIES.map((category) => (
            <span
              key={category.slug}
              aria-hidden
              className="block flex-1 rounded-sm opacity-40"
              style={{ background: `var(--ch-${category.token})` }}
            />
          ))}
        </div>

        <p className="mark mb-4">Channel 404</p>
        <h1 className="font-display text-[clamp(1.9rem,5vw,2.8rem)]">Nothing on this frequency</h1>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-[var(--ink-soft)]">
          The page you asked for isn&apos;t here. It may have moved, or the link may be stale.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/explore">Browse the explorer</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
