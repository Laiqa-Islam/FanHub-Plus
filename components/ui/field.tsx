"use client";

import { useId } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const controlStyles =
  "w-full border-[1.5px] border-[var(--ink)] bg-[var(--paper-2)] px-4 py-3 text-[0.95rem] text-[var(--ink)] placeholder:text-[var(--ink-faint)] transition-colors duration-200 focus:border-[var(--spot)] focus:bg-[var(--paper)] focus:outline-none disabled:opacity-60";

export function Field({
  label,
  error,
  hint,
  children,
  htmlFor,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--ink-soft)]"
      >
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-[0.8rem] text-[var(--ink-faint)]">{hint}</p>}
      {error && (
        <p
          role="alert"
          className="flex items-center gap-1.5 text-[0.8rem] font-medium text-[var(--spot)]"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <Field label={label} error={error} hint={hint} htmlFor={inputId}>
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        className={cn(controlStyles, error && "border-[var(--spot)]", className)}
        {...props}
      />
    </Field>
  );
}

export function Textarea({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  hint?: string;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <Field label={label} error={error} hint={hint} htmlFor={inputId}>
      <textarea
        id={inputId}
        aria-invalid={Boolean(error)}
        className={cn(controlStyles, "min-h-28 resize-y", error && "border-[var(--spot)]", className)}
        {...props}
      />
    </Field>
  );
}

export function Select({
  label,
  error,
  hint,
  className,
  id,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  hint?: string;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <Field label={label} error={error} hint={hint} htmlFor={inputId}>
      <select id={inputId} className={cn(controlStyles, "cursor-pointer", className)} {...props}>
        {children}
      </select>
    </Field>
  );
}
