"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Check, X, ChevronDown } from "lucide-react";

import { reviewSubmission } from "@/app/actions/submissions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * One pending submission with approve/reject controls.
 *
 * The body is rendered as HTML, which is safe here because the submit action
 * strips every tag from member input and re-wraps the plain text in <p>
 * elements itself — nothing a member types survives as markup.
 */
export function ReviewCard({
  id,
  title,
  category,
  categoryToken,
  authorName,
  authorEmail,
  submittedAt,
  body,
  mediaUrl,
}: {
  id: string;
  title: string;
  category: string;
  categoryToken: string;
  authorName: string;
  authorEmail: string;
  submittedAt: string;
  body: string;
  mediaUrl: string;
}) {
  const [state, action, pending] = useActionState(reviewSubmission, undefined);
  const [expanded, setExpanded] = useState(false);
  const [decision, setDecision] = useState("approved");

  useEffect(() => {
    if (state?.success && state.message) toast.success(state.message);
    else if (state?.message) toast.error(state.message);
  }, [state]);

  return (
    <article className="relative overflow-hidden border-[1.5px] border-[var(--rule-strong)] bg-[var(--paper)]">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ background: `var(--ch-${categoryToken})` }}
      />

      <div className="p-6">
        <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
          {category} · {submittedAt}
        </p>
        <h2 className="mt-2 font-display text-[1.25rem] font-bold">{title}</h2>
        <p className="mt-1.5 text-[0.85rem] text-[var(--ink-soft)]">
          {authorName}
          {authorEmail && <span className="text-[var(--ink-faint)]"> · {authorEmail}</span>}
        </p>

        {mediaUrl && (
          <div className="mt-4 overflow-hidden border-[1.5px] border-[var(--rule-strong)]">
            {/* Freshly uploaded Cloudinary asset; already sized on upload. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mediaUrl} alt="" className="max-h-64 w-full object-cover" />
          </div>
        )}

        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          className="mt-5 inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[var(--ink-soft)] transition-colors hover:text-[var(--spot)]"
        >
          {expanded ? "Hide" : "Read"} submission
          <ChevronDown
            className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")}
            aria-hidden
          />
        </button>

        {expanded && (
          <div
            className="prose-fanhub mt-5 max-h-96 overflow-y-auto border-[1.5px] border-[var(--rule-strong)] bg-[var(--paper-2)] p-5 text-[0.95rem]"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        )}

        <form action={action} className="mt-6 flex flex-col gap-3 border-t border-[var(--rule)] pt-5">
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="decision" value={decision} />

          <label className="sr-only" htmlFor={`note-${id}`}>
            Reviewer note
          </label>
          <input
            id={`note-${id}`}
            name="note"
            maxLength={500}
            placeholder="Optional note for the author…"
            className="w-full border-[1.5px] border-[var(--ink)] bg-[var(--paper-2)] px-4 py-2.5 text-[0.88rem] text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:border-[var(--spot)] focus:outline-none"
          />

          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              size="sm"
              variant="blue"
              loading={pending && decision === "approved"}
              onClick={() => setDecision("approved")}
            >
              <Check className="h-4 w-4" aria-hidden />
              Approve & publish
            </Button>
            <Button
              type="submit"
              size="sm"
              variant="outline"
              loading={pending && decision === "rejected"}
              onClick={() => setDecision("rejected")}
            >
              <X className="h-4 w-4" aria-hidden />
              Reject
            </Button>
          </div>
        </form>
      </div>
    </article>
  );
}
