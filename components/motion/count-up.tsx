"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Counts from zero to `to` when it scrolls into view.
 *
 * The final value is rendered on the server and only overwritten once the
 * tween starts, so the number is correct for a reader with JavaScript off,
 * for a crawler, and for anyone who has asked for reduced motion — none of
 * whom should be shown a zero that never moves.
 */
export function CountUp({
  to,
  duration = 1.6,
  className,
  suffix = "",
}: {
  to: number;
  duration?: number;
  className?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const node = ref.current;
      if (!node) return;
      if (document.documentElement.dataset.reducedMotion === "true") return;

      const counter = { value: 0 };

      gsap.to(counter, {
        value: to,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          node.textContent = `${Math.round(counter.value)}${suffix}`;
        },
        scrollTrigger: {
          trigger: node,
          start: "top 88%",
          once: true,
          // Only zero the display once we know the tween is about to run.
          // Setting it at mount would blank a server-rendered number for
          // anyone whose ScrollTrigger never fires.
          onEnter: () => {
            node.textContent = `0${suffix}`;
          },
        },
      });
    },
    { scope: ref, dependencies: [to, duration, suffix] },
  );

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {to}
      {suffix}
    </span>
  );
}
