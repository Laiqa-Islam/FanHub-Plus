import type { Metadata } from "next";
import Link from "next/link";
import { MailWarning, Clock, CheckCircle2, XCircle } from "lucide-react";

import { requireUser } from "@/lib/dal";
import { connectToDatabase } from "@/lib/db";
import { FanSubmission } from "@/models";
import { categoryBySlug } from "@/lib/constants";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SubmissionForm } from "@/components/submit/submission-form";
import { Button } from "@/components/ui/button";
import { relativeTime, cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Submit fan content" };
export const dynamic = "force-dynamic";

const STATUS = {
  pending: { icon: Clock, label: "Awaiting review", tone: "text-[var(--flag)]" },
  approved: { icon: CheckCircle2, label: "Published", tone: "text-[var(--spot-2)]" },
  rejected: { icon: XCircle, label: "Not published", tone: "text-[var(--spot)]" },
} as const;

export default async function SubmitPage() {
  const user = await requireUser();

  await connectToDatabase();
  const mine = await FanSubmission.find({ userId: user.id })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Breadcrumbs trail={[{ href: "/dashboard", label: "Dashboard" }, { label: "Submit" }]} />

      <header className="mb-10">
        <p className="mark mb-3">Fan submissions</p>
        <h1 className="font-display text-[clamp(2rem,5vw,2.8rem)]">Write for Fan Hub Plus</h1>
        <p className="mt-4 text-[1rem] leading-relaxed text-[var(--ink-soft)]">
          Got a build log, a theory, a recommendation list or a craft explainer? Send it in.
          An administrator reads every submission before it goes live.
        </p>
      </header>

      {user.emailVerified ? (
        <SubmissionForm />
      ) : (
        <div className="flex items-start gap-3 border border-[var(--flag)]/35 bg-[var(--flag)]/10 p-6">
          <MailWarning className="mt-0.5 h-5 w-5 shrink-0 text-[var(--flag)]" aria-hidden />
          <div>
            <p className="font-semibold">Confirm your email first</p>
            <p className="mt-1.5 text-[0.9rem] leading-relaxed text-[var(--ink-soft)]">
              Submissions are open to members with a confirmed email address. It only takes a
              moment.
            </p>
            <Button asChild size="sm" variant="outline" className="mt-4">
              <Link href="/verify-email">Send a new link</Link>
            </Button>
          </div>
        </div>
      )}

      {mine.length > 0 && (
        <section className="mt-16 border-t border-[var(--rule)] pt-10">
          <h2 className="mb-6 font-display text-[1.35rem]">Your submissions</h2>
          <ul className="flex flex-col gap-3">
            {mine.map((submission) => {
              const status = STATUS[submission.status as keyof typeof STATUS] ?? STATUS.pending;
              const Icon = status.icon;
              const category = categoryBySlug(submission.category);
              return (
                <li
                  key={String(submission._id)}
                  className="flex flex-wrap items-center gap-4 border-[1.5px] border-[var(--rule-strong)] bg-[var(--paper)] p-4"
                >
                  <Icon className={cn("h-4 w-4 shrink-0", status.tone)} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{submission.title}</p>
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                      {category?.name} · {status.label} · {relativeTime(submission.createdAt)}
                    </p>
                    {submission.reviewNote && (
                      <p className="mt-1.5 text-[0.84rem] text-[var(--ink-soft)]">
                        Reviewer note: {submission.reviewNote}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
