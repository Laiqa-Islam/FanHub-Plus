"use client";

import { useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { Scissors, Check } from "lucide-react";
import { toast } from "react-toastify";

import { toggleBookmark } from "@/app/actions/bookmarks";
import type { BookmarkTargetType } from "@/lib/bookmark-types";
import { cn } from "@/lib/utils";

/**
 * Clip / unclip control (SRS FR-9).
 *
 * "Clip" rather than "bookmark" because the whole interface is a printed
 * issue — you cut something out of a magazine, you don't bookmark it. The
 * scissors icon carries the same idea.
 *
 * Optimistic: the state flips immediately and rolls back if the server
 * refuses, so the button never feels laggy.
 */
export function BookmarkButton({
  targetType,
  targetId,
  initialBookmarked,
  signedIn,
  variant = "button",
  className,
}: {
  targetType: BookmarkTargetType;
  targetId: string;
  initialBookmarked: boolean;
  signedIn: boolean;
  /** `icon` for use inside a card corner, `button` for a detail page. */
  variant?: "button" | "icon";
  className?: string;
}) {
  const [clipped, setClipped] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  function handle(event: React.MouseEvent) {
    // Cards wrap the button in a link; clipping must not navigate.
    event.preventDefault();
    event.stopPropagation();

    if (!signedIn) {
      toast.info("Sign in to clip this for later.");
      return;
    }

    const previous = clipped;
    setClipped(!previous);

    startTransition(async () => {
      const result = await toggleBookmark(targetType, targetId, pathname);
      if (result.ok) {
        setClipped(result.bookmarked);
        toast.success(result.message);
      } else {
        setClipped(previous);
        toast.error(result.message);
      }
    });
  }

  const label = clipped ? "Remove from clippings" : "Clip for later";

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handle}
        disabled={isPending}
        aria-pressed={clipped}
        aria-label={label}
        title={label}
        className={cn(
          "grid h-8 w-8 place-items-center border-[1.5px] border-[var(--ink)] transition-colors disabled:opacity-60",
          clipped
            ? "bg-[var(--spot)] text-white"
            : "bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--paper-2)]",
          className,
        )}
      >
        {clipped ? (
          <Check className="h-4 w-4" aria-hidden />
        ) : (
          <Scissors className="h-4 w-4" aria-hidden />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handle}
      disabled={isPending}
      aria-pressed={clipped}
      className={cn(
        "inline-flex items-center gap-2 border-[1.5px] border-[var(--ink)] px-4 py-2 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.14em] transition-[transform,box-shadow,background-color] duration-150 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[4px_4px_0_var(--ink)] disabled:opacity-60",
        clipped ? "bg-[var(--spot)] text-white" : "bg-[var(--paper)] text-[var(--ink)]",
        className,
      )}
    >
      {clipped ? (
        <Check className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <Scissors className="h-3.5 w-3.5" aria-hidden />
      )}
      {clipped ? "Clipped" : "Clip this"}
    </button>
  );
}
