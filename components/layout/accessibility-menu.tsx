"use client";

import { useState } from "react";
import { Moon, Sun, Type, Accessibility, Check } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

const FONT_STEPS = [
  { value: 90, label: "Small" },
  { value: 100, label: "Default" },
  { value: 115, label: "Large" },
  { value: 130, label: "Largest" },
];

/** Dark-mode toggle, text-size control and motion switch (SRS FR-12). */
export function AccessibilityMenu() {
  const { resolvedTheme, toggleTheme, fontScale, setFontScale, reducedMotion, setReducedMotion } =
    useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
        className="grid h-10 w-10 place-items-center border-[1.5px] border-[var(--rule-strong)] text-[var(--ink-soft)] transition-colors hover:border-[var(--spot)] hover:text-[var(--spot)]"
      >
        {resolvedTheme === "dark" ? (
          <Sun className="h-[18px] w-[18px]" aria-hidden />
        ) : (
          <Moon className="h-[18px] w-[18px]" aria-hidden />
        )}
      </button>

      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            aria-label="Display and accessibility options"
            className={cn(
              "grid h-10 w-10 place-items-center border-[1.5px] border-[var(--rule-strong)] text-[var(--ink-soft)] transition-colors hover:border-[var(--spot)] hover:text-[var(--spot)]",
              open && "border-[var(--spot)] text-[var(--spot)]",
            )}
          >
            <Accessibility className="h-[18px] w-[18px]" aria-hidden />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            sideOffset={10}
            align="end"
            className="z-[70] w-64 border-[1.5px] border-[var(--ink)] bg-[var(--paper)] p-4 shadow-[var(--shadow-lg)]"
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
                    "border px-1 py-2 font-mono text-[0.68rem] transition-colors",
                    fontScale === step.value
                      ? "border-[var(--spot)] bg-[var(--spot-wash)] text-[var(--spot-deep)]"
                      : "border-[var(--rule)] text-[var(--ink-soft)] hover:border-[var(--rule-strong)]",
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
              className="flex w-full items-center justify-between border-[1.5px] border-[var(--rule-strong)] px-3 py-2.5 text-left text-[0.85rem] text-[var(--ink)] transition-colors hover:border-[var(--rule-strong)]"
            >
              <span>Reduce motion</span>
              <span
                className={cn(
                  "grid h-5 w-5 place-items-center border transition-colors",
                  reducedMotion
                    ? "border-[var(--spot)] bg-[var(--spot)] text-white"
                    : "border-[var(--rule-strong)]",
                )}
              >
                {reducedMotion && <Check className="h-3.5 w-3.5" aria-hidden />}
              </span>
            </button>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
