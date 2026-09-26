import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * The channel key: eight spot inks laid side by side, the way a print shop
 * pulls a colour bar along the edge of a sheet to check the run.
 */
export function InkStrip({
  className,
  height = 6,
  animated = false,
}: {
  className?: string;
  height?: number;
  animated?: boolean;
}) {
  return (
    <div aria-hidden className={cn("ink-strip", className)} style={{ height }}>
      {CATEGORIES.map((category, index) => (
        <span
          key={category.slug}
          className={cn("block h-full w-full origin-left", animated && "animate-[ink-roll_.5s_both]")}
          style={{
            background: `var(--ch-${category.token})`,
            animationDelay: animated ? `${index * 60}ms` : undefined,
          }}
        />
      ))}
    </div>
  );
}

/**
 * A heading printed twice — the ink layer, and a spot-ink ghost sitting
 * slightly out of register behind it.
 *
 * The ghost is generated from `data-ghost` in CSS rather than as a real
 * element, so it never reaches the accessibility tree and the word is
 * announced once.
 */
export function Misreg({
  children,
  ghostInk,
  className,
  as: Tag = "span",
}: {
  children: string;
  /** CSS colour for the offset layer. Defaults to the house spot ink. */
  ghostInk?: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3";
}) {
  return (
    <Tag className={cn("misreg", className)} data-ghost={children} style={
      ghostInk ? ({ ["--ghost-ink" as string]: ghostInk } as React.CSSProperties) : undefined
    }>
      {children}
    </Tag>
  );
}

/** Printer's registration crosshair. Pure ornament, and it knows it. */
export function RegMark({ className }: { className?: string }) {
  return <span aria-hidden className={cn("reg-mark", className)} />;
}

/** A gummed label, rotated slightly off-square. */
export function Sticker({
  children,
  ink = "var(--spot)",
  className,
}: {
  children: React.ReactNode;
  ink?: string;
  className?: string;
}) {
  return (
    <span className={cn("sticker", className)} style={{ background: ink }}>
      {children}
    </span>
  );
}

/** Section heading: rule, number, title — a contents-page convention. */
export function PressHeading({
  mark,
  title,
  ghostInk,
  action,
}: {
  mark: string;
  title: string;
  ghostInk?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-10 border-t-2 border-[var(--ink)] pt-4">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mark mb-3">{mark}</p>
          <Misreg
            as="h2"
            ghostInk={ghostInk}
            className="text-[clamp(2.2rem,5.5vw,3.8rem)]"
          >
            {title}
          </Misreg>
        </div>
        {action}
      </div>
    </div>
  );
}
