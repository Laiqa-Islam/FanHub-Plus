"use client";

import { useState } from "react";
import { Type, Accessibility, Check } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

const FONT_STEPS = [
  { value: 90, label: "Small" },
  { value: 100, label: "Default" },
  { value: 115, label: "Large" },
  { value: 130, label: "Largest" },
];

/**
 * Text-size control and motion switch.
 *
 * The light/dark toggle that used to sit beside these is gone: Neon Oni runs
 * on one dark ground, so there was nothing left for it to switch between.
 */
export function AccessibilityMenu() {
  const { fontScale, setFontScale, reducedMotion, setReducedMotion } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Display and accessibility options"
          className={cn(
            "grid h-10 w-10 place-items-center rounded-full border border-[var(--edge-strong)] text-[var(--ink-soft)] transition-colors",
            open
              ? "border-[var(--n2)] text-[var(--n2)]"
              : "hover:border-[var(--n2)] hover:text-[var(--n2)]",
          )}
        >
          <Accessibility className="h-[18px] w-[18px]" aria-hidden />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={10}
          align="end"
          className="z-[70] w-64 rounded-2xl border border-[var(--edge)] bg-[var(--paper-3)] p-4 shadow-[var(--lift-lg)]"
        >
          <p className="mark mb-3 flex items-center gap-2">
            <Type className="h-3.5 w-3.5" aria-hidden /> Text size
          </p>
          <div className="mb-4 grid grid-cols-4 gap-1.5">
            {FONT_STEPS.map((step) => (
              <button
                key={step.value}
                type="button"
                onClick={() => setFontScale(step.value)}
                aria-pressed={fontScale === step.value}
                className={cn(
                  "rounded-lg border px-1 py-2 font-mono text-[0.62rem] transition-colors",
                  fontScale === step.value
                    ? "border-[var(--n2)] bg-[var(--spot-2-wash)] text-[var(--n2)]"
                    : "border-[var(--edge)] text-[var(--ink-soft)] hover:border-[var(--edge-strong)] hover:text-[var(--ink)]",
                )}
              >
                {step.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setReducedMotion(!reducedMotion)}
            aria-pressed={reducedMotion}
            className="flex w-full items-center justify-between rounded-xl border border-[var(--edge)] px-3 py-2.5 text-left text-[0.85rem] text-[var(--ink)] transition-colors hover:border-[var(--n2)]"
          >
            <span>Reduce motion</span>
            <span
              className={cn(
                "grid h-5 w-5 place-items-center rounded-md border transition-colors",
                reducedMotion
                  ? "border-[var(--n3)] bg-[var(--n3)] text-[var(--void)]"
                  : "border-[var(--edge-strong)]",
              )}
            >
              {reducedMotion && <Check className="h-3.5 w-3.5" aria-hidden />}
            </span>
          </button>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
