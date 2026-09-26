import type { Metadata } from "next";
import Link from "next/link";
import { Inbox } from "lucide-react";

import { requireAdmin } from "@/lib/dal";
import { connectToDatabase } from "@/lib/db";
import { FanSubmission, User } from "@/models";
import { categoryBySlug } from "@/lib/constants";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ReviewCard } from "@/components/admin/review-card";
import { relativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Review submissions" };
export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  await requireAdmin();
  await connectToDatabase();

  // Registering the User model before populate() runs is why models/index.ts
  // exists as a barrel.
  void User;

  const pending = await FanSubmission.find({ status: "pending" })
    .sort({ createdAt: 1 })
    .populate("userId", "name email")
    .lean();

  const recent = await FanSubmission.find({ status: { $ne: "pending" } })
    .sort({ reviewedAt: -1 })
    .limit(8)
    .lean();

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <Breadcrumbs trail={[{ label: "Admin" }, { label: "Submissions" }]} />

      <header className="mb-10">
        <p className="mark mb-3">Moderation queue</p>
        <h1 className="font-display text-[clamp(2rem,5vw,2.8rem)]">Fan submissions</h1>
        <p className="mt-4 text-[1rem] leading-relaxed text-[var(--ink-soft)]">
          Approving publishes the piece to its channel immediately. Rejecting keeps it private
          and records your note for the author.
        </p>
      </header>

      {pending.length === 0 ? (
        <div className="border-[1.5px] border-dashed border-[var(--rule-strong)] px-6 py-16 text-center">
          <Inbox className="mx-auto h-8 w-8 text-[var(--ink-faint)]" aria-hidden />
          <p className="mt-4 font-semibold">Queue is clear</p>
          <p className="mx-auto mt-2 max-w-sm text-[0.9rem] text-[var(--ink-soft)]">
            Nothing is waiting for review right now.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {pending.map((submission) => {
            const author = submission.userId as unknown as { name?: string; email?: string };
            return (
              <ReviewCard
                key={String(submission._id)}
                id={String(submission._id)}
                title={submission.title}
                category={categoryBySlug(submission.category)?.name ?? submission.category}
                categoryToken={categoryBySlug(submission.category)?.token ?? "anime"}
                authorName={author?.name ?? "Unknown member"}
                authorEmail={author?.email ?? ""}
                submittedAt={relativeTime(submission.createdAt)}
                body={submission.body}
                mediaUrl={submission.mediaUrl ?? ""}
              />
            );
          })}
        </div>
      )}

      {recent.length > 0 && (
        <section className="mt-16 border-t border-[var(--rule)] pt-10">
          <h2 className="mb-5 font-display text-[1.3rem]">Recently reviewed</h2>
          <ul className="flex flex-col gap-2">
            {recent.map((submission) => (
              <li
                key={String(submission._id)}
                className="flex flex-wrap items-center gap-3 border-[1.5px] border-[var(--rule-strong)] px-4 py-3 text-[0.88rem]"
              >
                <span className="min-w-0 flex-1 truncate">{submission.title}</span>
                <span
                  className={
                    submission.status === "approved"
                      ? "font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[var(--spot-2)]"
                      : "font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[var(--spot)]"
                  }
                >
                  {submission.status}
                </span>
                {submission.publishedContentId && (
                  <Link
                    href="/explore?genre=Fan%20submission"
                    className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-[var(--ink-soft)] hover:text-[var(--spot)]"
                  >
                    View
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
