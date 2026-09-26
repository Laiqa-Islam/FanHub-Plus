import type { Metadata } from "next";

import { connectToDatabase } from "@/lib/db";
import { FaqEntry } from "@/models";
import { Misreg } from "@/components/press";
import { ResourceManager, type FieldSpec } from "@/components/admin/resource-manager";

export const metadata: Metadata = { title: "FAQ · Admin" };
export const dynamic = "force-dynamic";

const FIELDS: FieldSpec[] = [
  { name: "question", label: "Question", required: true },
  { name: "answer", label: "Answer", kind: "textarea", required: true },
  { name: "tags", label: "Tags", half: true, hint: "Comma separated." },
  { name: "isPublished", label: "Published", kind: "checkbox", half: true },
];

export default async function AdminFaqPage() {
  await connectToDatabase();
  const docs = await FaqEntry.find().sort({ createdAt: -1 }).limit(200).lean();

  const rows = docs.map((doc) => ({
    id: String(doc._id),
    title: doc.question,
    meta: `${doc.isPublished ? "published" : "hidden"} · used ${doc.useCount ?? 0}× · ${(doc.tags ?? []).join(", ") || "untagged"}`,
    values: {
      question: doc.question,
      answer: doc.answer,
      tags: (doc.tags ?? []).join(", "),
      isPublished: Boolean(doc.isPublished),
    },
  }));

  return (
    <div>
      <div className="mb-8 border-t-2 border-[var(--ink)] pt-4">
        <p className="mark mb-3">Assistant knowledge base</p>
        <Misreg as="h1" className="text-[clamp(2rem,5vw,3.2rem)]" ghostInk="var(--ch-gaming)">
          FAQ
        </Misreg>
        <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-[var(--ink-soft)]">
          These entries back the optional AI assistant (Phase 9) and are already used to answer
          common questions about the platform.
        </p>
      </div>

      <ResourceManager kind="faq" rows={rows} fields={FIELDS} singular="entry" />
    </div>
  );
}
