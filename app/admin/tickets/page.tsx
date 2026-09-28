import type { Metadata } from "next";
import Link from "next/link";
import { Ticket, MapPin, CalendarDays } from "lucide-react";

import { connectToDatabase } from "@/lib/db";
import { EventTicket, Event, User } from "@/models";
import { categoryBySlug } from "@/lib/constants";
import { Misreg } from "@/components/press";
import { TicketDecision } from "@/components/admin/ticket-decision";
import { relativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Pass requests · Admin" };
export const dynamic = "force-dynamic";

const STATUS_INK: Record<string, string> = {
  pending: "var(--n3)",
  confirmed: "var(--n2)",
  rejected: "var(--n1)",
  released: "var(--ink-faint)",
};

export default async function AdminTicketsPage() {
  await connectToDatabase();

  // Pending first — this page exists to clear a queue, so anything already
  // decided is history and belongs underneath.
  const docs = await EventTicket.aggregate([
    {
      $addFields: {
        rank: { $cond: [{ $eq: ["$status", "pending"] }, 0, 1] },
      },
    },
    { $sort: { rank: 1, createdAt: -1 } },
    { $limit: 80 },
  ]);

  const eventIds = [...new Set(docs.map((d) => String(d.eventId)))];
  const userIds = [...new Set(docs.map((d) => String(d.userId)))];

  const [events, users] = await Promise.all([
    Event.find({ _id: { $in: eventIds } })
      .select("slug title city country startsAt category capacity")
      .lean(),
    User.find({ _id: { $in: userIds } })
      .select("name email")
      .lean(),
  ]);

  const eventById = new Map(events.map((e) => [String(e._id), e]));
  const userById = new Map(users.map((u) => [String(u._id), u]));
  const waiting = docs.filter((d) => d.status === "pending").length;

  return (
    <div>
      <header className="mb-10">
        <p className="mark mb-3 text-[var(--n3)]">
          Approvals · {waiting} awaiting a decision
        </p>
        <Misreg
          as="h1"
          className="text-[clamp(1.6rem,4vw,2.6rem)]"
          ghostInk="var(--n2)"
        >
          Pass requests
        </Misreg>
        <p className="mt-5 max-w-2xl text-[0.98rem] leading-relaxed text-[var(--ink-soft)]">
          Members apply for a place and it waits here. Approving issues the pass
          and its booking code; declining sends the reason back to them.
          Capacity is re-checked at the moment you approve, so a full event
          cannot be oversold from this queue.
        </p>
      </header>

      {docs.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--edge-strong)] px-6 py-16 text-center text-[var(--ink-soft)]">
          Nobody has applied for a pass yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {docs.map((doc) => {
            const event = eventById.get(String(doc.eventId));
            const member = userById.get(String(doc.userId));
            const ink = `var(--ch-${categoryBySlug(String(event?.category ?? "anime"))?.token ?? "anime"})`;
            const statusInk =
              STATUS_INK[String(doc.status)] ?? "var(--ink-faint)";

            return (
              <li
                key={String(doc._id)}
                className="rounded-2xl border border-[var(--edge)] bg-[var(--paper-3)] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className="rounded-full px-2.5 py-1 font-mono text-[0.52rem] font-bold uppercase tracking-[0.14em] text-[var(--void)]"
                        style={{ background: statusInk }}
                      >
                        {String(doc.status)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 font-mono text-[0.6rem] tracking-[0.1em] text-[var(--ink-faint)]">
                        <Ticket className="h-3 w-3" aria-hidden />
                        {String(doc.code)}
                      </span>
                      <span className="font-mono text-[0.6rem] text-[var(--ink-faint)]">
                        {relativeTime(doc.createdAt)}
                      </span>
                    </div>

                    <p className="mt-2.5 font-display text-[1rem] font-bold leading-tight">
                      {event ? (
                        <Link
                          href={`/events/${event.slug}`}
                          className="transition-colors hover:text-[var(--n2)]"
                          style={{ color: "inherit" }}
                        >
                          {String(event.title)}
                        </Link>
                      ) : (
                        "Event no longer exists"
                      )}
                    </p>

                    <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.82rem] text-[var(--ink-soft)]">
                      <span>
                        {String(doc.holderName || member?.name || "Unknown")}
                        <span className="text-[var(--ink-faint)]">
                          {" · "}
                          {String(doc.holderEmail || member?.email || "")}
                        </span>
                      </span>
                      {event && (
                        <>
                          <span className="inline-flex items-center gap-1.5 text-[var(--ink-faint)]">
                            <MapPin className="h-3 w-3" aria-hidden />
                            {String(event.city)}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-[var(--ink-faint)]">
                            <CalendarDays className="h-3 w-3" aria-hidden />
                            {new Date(
                              event.startsAt as Date,
                            ).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              timeZone: "UTC",
                            })}
                          </span>
                          {Number(event.capacity ?? 0) > 0 && (
                            <span className="font-mono text-[0.6rem] text-[var(--ink-faint)]">
                              cap {String(event.capacity)}
                            </span>
                          )}
                        </>
                      )}
                    </p>

                    {doc.decisionNote && (
                      <p className="mt-2 text-[0.8rem] italic text-[var(--ink-faint)]">
                        &ldquo;{String(doc.decisionNote)}&rdquo;
                      </p>
                    )}
                  </div>

                  <span
                    aria-hidden
                    className="h-10 w-1 shrink-0 rounded-full"
                    style={{ background: ink }}
                  />
                </div>

                {doc.status === "pending" && (
                  <div className="mt-4 border-t border-[var(--rule)] pt-3.5">
                    <TicketDecision code={String(doc.code)} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
