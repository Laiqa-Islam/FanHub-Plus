"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

import { submitFanContent } from "@/app/actions/submissions";
import { CATEGORIES } from "@/lib/constants";
import { Input, Textarea, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

const MIN_CHARS = 200;

export function SubmissionForm() {
  const [state, action, pending] = useActionState(submitFanContent, undefined);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (state?.success && state.message) toast.success(state.message);
    else if (state?.message) toast.error(state.message);
  }, [state]);

  if (state?.success) {
    return (
      <div className="flex items-start gap-3 border border-[var(--spot-2)]/35 bg-[var(--spot-2-wash)] p-6">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--spot-2)]" aria-hidden />
        <div>
          <p className="font-semibold text-[var(--ink)]">Submission received</p>
          <p className="mt-1.5 text-[0.9rem] leading-relaxed text-[var(--ink-soft)]">
            {state.message} You&apos;ll see it on your channel once it&apos;s approved.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Submit another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-6">
      <Input
        label="Title"
        name="title"
        required
        maxLength={120}
        placeholder="What are you writing about?"
        error={state?.errors?.title}
      />

      <Select label="Channel" name="category" required error={state?.errors?.category}>
        <option value="">Pick a channel…</option>
        {CATEGORIES.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.name}
          </option>
        ))}
      </Select>

      <Textarea
        label="Your piece"
        name="body"
        required
        rows={14}
        onChange={(event) => setChars(event.target.value.trim().length)}
        placeholder="Write it as you'd want to read it. Separate paragraphs with a blank line."
        error={state?.errors?.body}
        hint={
          chars < MIN_CHARS
            ? `${chars} / ${MIN_CHARS} characters minimum`
            : `${chars} characters — ready to submit`
        }
      />

      <div className="flex flex-col gap-2">
        <label
          htmlFor="submission-image"
          className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--ink-soft)]"
        >
          Cover image (optional)
        </label>
        <input
          id="submission-image"
          type="file"
          name="image"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="w-full border-[1.5px] border-[var(--ink)] bg-[var(--paper-2)] p-3 text-[0.88rem] text-[var(--ink-soft)] file:mr-3 file:file:border-0 file:bg-[var(--spot)] file:px-4 file:py-1.5 file:text-[0.82rem] file:font-semibold file:text-white"
        />
        <p className="text-[0.8rem] text-[var(--ink-faint)]">
          Only upload images you have the right to use. JPG, PNG, WebP or GIF, up to 5 MB.
        </p>
        {state?.errors?.image && (
          <p role="alert" className="text-[0.82rem] font-medium text-[var(--spot)]">
            {state.errors.image}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-[var(--rule)] pt-6">
        <p className="text-[0.82rem] leading-relaxed text-[var(--ink-faint)]">
          Submissions are reviewed by an administrator before they appear.
        </p>
        <Button type="submit" size="lg" loading={pending}>
          Submit for review
        </Button>
      </div>
    </form>
  );
}
