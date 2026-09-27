import type { Metadata } from "next";
import { Inbox } from "lucide-react";

import { connectToDatabase } from "@/lib/db";
import { Feedback } from "@/models";
import { Misreg } from "@/components/press";
import { FeedbackRow } from "@/components/admin/feedback-row";
import { relativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Feedback · Admin" };
export const dynamic = "force-dynamic";

export default async function AdminFeedbackPage() {
  await connectToDatabase();

  // Open reports first, then newest — triage order, not chronological.
  const docs = await Feedback.aggregate([
    {
      $addFields: {
        rank: {
          $switch: {
            branches: [
              { case: { $eq: ["$status", "open"] }, then: 0 },
              { case: { $eq: ["$status", "in-review"] }, then: 1 },
            ],
            default: 2,
          },
        },
      },
    },
    { $sort: { rank: 1, createdAt: -1 } },
    { $limit: 200 },
  ]);

  const items = docs.map((doc) => ({
    id: String(doc._id),
    type: doc.type,
    subject: doc.subject || "(no subject)",
    message: doc.message,
    name: doc.name ?? "",
    email: doc.email ?? "",
    status: doc.status ?? "open",
    adminNote: doc.adminNote ?? "",
    at: relativeTime(doc.createdAt),
  }));

  const open = items.filter((item) => item.status !== "resolved").length;

  return (
    <div>
      <div className="mb-8 border-t border-[var(--rule-strong)] pt-4">
        <p className="mark mb-3">
          {items.length} total · {open} needing attention
        </p>
        <Misreg as="h1" className="text-[clamp(1.7rem,4.2vw,2.6rem)]" ghostInk="var(--ch-comics)">
          Feedback
        </Misreg>
      </div>

      {items.length === 0 ? (
        <div className="border border-dashed border-[var(--edge-strong)] px-6 py-16 text-center">
          <Inbox className="mx-auto h-8 w-8 text-[var(--ink-faint)]" aria-hidden />
          <p className="mt-4 font-display text-[1.08rem] leading-none">
            No reports yet
          </p>
          <p className="mx-auto mt-2 max-w-sm text-[0.9rem] text-[var(--ink-soft)]">
            Bugs, suggestions and queries sent from the feedback form arrive here.
          </p>
        </div>
      ) : (
        <ul className="border-t border-[var(--rule-strong)]">
          {items.map((item) => (
            <FeedbackRow key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
}
