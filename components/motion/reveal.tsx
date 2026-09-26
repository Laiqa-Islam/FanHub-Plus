"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Scroll-triggered reveal. Children marked `.reveal` start hidden in CSS and
 * are animated in when the container enters the viewport, so there is no
 * flash-of-unstyled-motion on load.
 *
 * `stagger` sequences multiple `.reveal` children; `direction` picks the axis.
 */
export function Reveal({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  direction = "up",
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
  once?: boolean;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (document.documentElement.dataset.reducedMotion === "true") {
        gsap.set(".reveal", { opacity: 1, y: 0, x: 0, scale: 1, clipPath: "none" });
        return;
      }

      // The house reveal is an ink roll: the clipping is wiped onto the page
      // left to right, the way a roller passes over a sheet. Fading upward is
      // the generic choice and it says nothing about the subject.
      const from: gsap.TweenVars = { opacity: 0, clipPath: "inset(0 100% 0 0)" };
      if (direction === "up") from.y = 18;
      if (direction === "down") from.y = -18;
      if (direction === "left") from.x = 24;
      if (direction === "right") from.x = -24;
      if (direction === "scale") from.scale = 0.97;

      const targets = gsap.utils.toArray<HTMLElement>(".reveal");
      if (targets.length === 0) return;

      const tween = gsap.fromTo(targets, from, {
        opacity: 1,
        clipPath: "inset(0 0% 0 0)",
        y: 0,
        x: 0,
        scale: 1,
        duration: 0.7,
        delay,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: scope.current,
          start: "top 85%",
          toggleActions: once ? "play none none none" : "play none none reverse",
        },
      });

      // Failsafe: `.reveal` starts at opacity 0 in CSS, so if the tween never
      // runs — ScrollTrigger mismeasuring, or a stalled/throttled rAF loop —
      // the content would stay invisible for good. If the container is on
      // screen but nothing has finished animating, show it outright.
      //
      // The viewport check matters: below-the-fold sections are *supposed* to
      // sit at progress 0 until scrolled to, and forcing those visible would
      // throw away the scroll reveal entirely.
      const failsafe = setTimeout(() => {
        const node = scope.current;
        if (!node || tween.progress() === 1) return;

        const rect = node.getBoundingClientRect();
        const onScreen = rect.top < window.innerHeight && rect.bottom > 0;
        if (onScreen) {
          gsap.set(targets, { opacity: 1, y: 0, x: 0, scale: 1, clipPath: "none" });
        }
      }, 4000);

      return () => clearTimeout(failsafe);
    },
    { scope, dependencies: [direction, stagger, delay, once] },
  );

  return (
    <div ref={scope} className={cn(className)}>
      {children}
    </div>
  );
}
