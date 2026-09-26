import { cn } from "@/lib/utils";

/**
 * Spot-ink duotone, the way a riso lays one colour over a greyscale plate.
 *
 * The image itself must already be `grayscale`; this renders the ink layers
 * on top of it.
 *
 * Getting the blend right took a correction worth recording: a full-opacity
 * `screen` layer over a light photograph lightens every pixel toward the ink
 * and erases the picture completely. `multiply` is the correct operator on a
 * pale ground — it darkens toward the ink while keeping tonal separation —
 * and `screen` is its counterpart on a dark ground. So each theme gets one
 * blend at a moderate opacity, never both at full strength.
 */
export function Duotone({
  ink,
  strength = 0.72,
  halftone = true,
  className,
}: {
  /** CSS colour for the ink pass. */
  ink: string;
  /** 0–1. Higher prints heavier and loses more detail. */
  strength?: number;
  halftone?: boolean;
  className?: string;
}) {
  return (
    <span aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      {/* Light ground: darken toward the ink. */}
      <span
        className="absolute inset-0 mix-blend-multiply dark:hidden"
        style={{ background: ink, opacity: strength }}
      />
      {/* Dark ground: lighten toward the ink. */}
      <span
        className="absolute inset-0 hidden mix-blend-screen dark:block"
        style={{ background: ink, opacity: strength * 0.8 }}
      />
      {halftone && (
        <span className="halftone absolute inset-0 text-[var(--ink)] opacity-[0.18] mix-blend-multiply" />
      )}
    </span>
  );
}
