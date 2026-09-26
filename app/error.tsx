"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[route error]", error);
  }, [error]);

  return (
    <div className="grid min-h-[70vh] place-items-center px-5">
      <div className="max-w-md text-center">
        <p className="mark mb-4">Signal lost</p>
        <h1 className="font-display text-[clamp(1.8rem,4.5vw,2.6rem)]">
          This page didn&apos;t come through
        </h1>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-[var(--ink-soft)]">
          Something broke while loading. Try again — if it keeps happening, the database
          connection is the usual culprit.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
