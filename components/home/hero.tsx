"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

import { CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { RegMark, Sticker } from "@/components/press";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The cover of the issue.
 *
 * Deliberately asymmetric and left-aligned — a centred headline stack over a
 * gradient is the layout every generator reaches for, and it says nothing
 * about print. The load sequence is a press run: ink layers arrive badly out
 * of register and slide into place, the masthead wipes on like a roller
 * passing over the sheet, then the colour bar prints.
 */
export function Hero({ issueNumber, pieceCount }: { issueNumber: string; pieceCount: number }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (document.documentElement.dataset.reducedMotion === "true") return;

      const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });

      timeline
        .fromTo(
          "[data-masthead]",
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.9, stagger: 0.12 },
        )
        // The ghost layers overshoot, then settle into register.
        .fromTo(
          "[data-ghost-layer]",
          { x: 26, y: -18, opacity: 0 },
          { x: 3, y: 3, opacity: 1, duration: 0.7, stagger: 0.1 },
          "-=0.6",
        )
        .fromTo(
          "[data-strap]",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.35",
        )
        .fromTo(
          "[data-ink-bar]",
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.45, stagger: 0.05 },
          "-=0.3",
        )
        .fromTo(
          "[data-cover-cta]",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 },
          "-=0.2",
        )
        .fromTo(
          "[data-colophon]",
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          "-=0.3",
        );

      // Paper drifts a touch slower than the page — depth without parallax cliché.
      gsap.to("[data-drift]", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom top", scrub: true },
      });

      // Frames can stall (background tab, throttled rAF); timers do not.
      const failsafe = setTimeout(
        () => {
          if (timeline.progress() < 1) timeline.progress(1);
        },
        (timeline.duration() + 1.5) * 1000,
      );
      return () => clearTimeout(failsafe);
    },
    { scope },
  );

  return (
    <section ref={scope} className="relative border-b-2 border-[var(--ink)]">
      {/* Halftone field, the tone a riso would lay under a cover image */}
      <div
        data-drift
        aria-hidden
        className="halftone pointer-events-none absolute inset-0 -z-10 text-[var(--spot)] opacity-[0.18]"
      />

      <div className="mx-auto max-w-[88rem] px-5 pb-16 pt-10 sm:px-8">
        {/* Colophon strip — issue, date, price. Straight off a zine cover. */}
        <div
          data-colophon
          className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-[var(--rule)] pb-3 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-[var(--ink-faint)]"
        >
          <RegMark className="text-[var(--ink)]" />
          <span>Issue {issueNumber}</span>
          <span>Eight channels</span>
          <span>{pieceCount} pieces this run</span>
          <span className="ml-auto text-[var(--spot-deep)]">Free · take one</span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end">
          {/* Masthead */}
          <div>
            <h1 className="flex flex-col">
              {["Fandom", "in print"].map((word, index) => (
                <span key={word} className="relative inline-block">
                  <span
                    data-ghost-layer
                    aria-hidden
                    className="absolute inset-0 -z-10 text-[clamp(3.4rem,13vw,9.5rem)] leading-[0.82]"
                    style={{ color: index === 0 ? "var(--spot)" : "var(--spot-2)" }}
                  >
                    {word}
                  </span>
                  <span
                    data-masthead
                    className="block text-[clamp(3.4rem,13vw,9.5rem)] leading-[0.82]"
                  >
                    {word}
                  </span>
                </span>
              ))}
            </h1>

            <p
              data-strap
              className="mt-7 max-w-lg border-l-4 border-[var(--spot)] pl-5 text-[1.12rem] leading-relaxed text-[var(--ink-soft)]"
            >
              Anime, gaming, film, television, K-Pop, comics, manga and cosplay — written up
              properly, printed in eight inks, and stapled together in one place.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <span data-cover-cta>
                <Button asChild size="lg">
                  <Link href="/explore">
                    Read the issue
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </span>
              <span data-cover-cta>
                <Button asChild size="lg" variant="outline">
                  <Link href="/media">Watch & listen</Link>
                </Button>
              </span>
            </div>
          </div>

          {/* Channel index — a contents column, not a card grid */}
          <div className="border-t-2 border-[var(--ink)] pt-4">
            <p className="mark mb-4">Contents</p>
            <ul className="flex flex-col">
              {CATEGORIES.map((category, index) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="group flex items-center gap-4 border-b border-[var(--rule)] py-2.5 transition-colors hover:bg-[var(--paper-2)]"
                  >
                    <span className="w-6 shrink-0 font-mono text-[0.68rem] tabular-nums text-[var(--ink-faint)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      data-ink-bar
                      aria-hidden
                      className="h-4 w-4 shrink-0"
                      style={{ background: `var(--ch-${category.token})` }}
                    />
                    <span className="font-display text-[1.45rem] uppercase leading-none transition-transform duration-200 group-hover:translate-x-1">
                      {category.name}
                    </span>
                    <span className="ml-auto font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--ink-faint)] opacity-0 transition-opacity group-hover:opacity-100">
                      Turn to →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center justify-between">
              <Sticker ink="var(--ink)">Printed {new Date().getFullYear()}</Sticker>
              <RegMark className="text-[var(--ink-faint)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
