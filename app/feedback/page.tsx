import type { Metadata } from "next";
import { Bug, Lightbulb, HelpCircle } from "lucide-react";

import { getCurrentUser } from "@/lib/dal";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { InkStrip, Misreg } from "@/components/press";
import { FeedbackForm } from "@/components/feedback/feedback-form";

export const metadata: Metadata = {
  title: "Send feedback",
  description: "Report a bug, suggest a feature, or ask a question about Fan Hub Plus.",
};

export const dynamic = "force-dynamic";

const KINDS = [
  { icon: Bug, title: "Bug", body: "Something is broken or behaving oddly." },
  { icon: Lightbulb, title: "Suggestion", body: "An idea for something that should exist." },
  { icon: HelpCircle, title: "Query", body: "A question about the site or its content." },
];

export default async function FeedbackPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <header className="border-b-2 border-[var(--ink)]">
        <div className="mx-auto max-w-3xl px-5 pb-8 pt-8">
          <Breadcrumbs trail={[{ label: "Feedback" }]} />
          <p className="mark mb-3">Letters page</p>
          <Misreg as="h1" className="text-[clamp(2.4rem,7vw,4.4rem)]" ghostInk="var(--ch-comics)">
            Write in
          </Misreg>
          <p className="mt-5 max-w-lg border-l-4 border-[var(--ch-comics)] pl-5 text-[1.02rem] leading-relaxed text-[var(--ink-soft)]">
            Found a bug, got an idea, or just want to ask something? Everything sent here is
            read by an administrator.
          </p>
        </div>
        <InkStrip height={5} />
      </header>

      <div className="mx-auto max-w-3xl px-5 py-10">
        <div className="mb-10 grid gap-px border-[1.5px] border-[var(--ink)] bg-[var(--ink)] sm:grid-cols-3">
          {KINDS.map((kind) => (
            <div key={kind.title} className="bg-[var(--paper)] p-4">
              <kind.icon className="h-4 w-4 text-[var(--spot)]" aria-hidden />
              <p className="mt-3 font-display text-[1.25rem] uppercase leading-none">
                {kind.title}
              </p>
              <p className="mt-1.5 text-[0.85rem] leading-snug text-[var(--ink-soft)]">
                {kind.body}
              </p>
            </div>
          ))}
        </div>

        <FeedbackForm signedIn={Boolean(user)} />
      </div>
    </div>
  );
}
