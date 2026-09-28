import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import {
  CalendarDays,
  MapPin,
  Clock,
  ArrowUpRight,
  CalendarPlus,
  Hourglass,
  UserRound,
} from "lucide-react";

import { connectToDatabase } from "@/lib/db";
import { Event, EventTicket } from "@/models";
import { categoryBySlug } from "@/lib/constants";
import { requireUser } from "@/lib/dal";
import { PrintButton } from "@/components/events/print-button";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Your pass" };
export const dynamic = "force-dynamic";

function longDate(value: Date) {
  return new Date(value).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function time(value: Date) {
  return new Date(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export default async function TicketPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  // A pass is somebody's booking, so it is addressed by a random code *and*
  // checked against the session — the code alone must not be enough.
  const user = await requireUser();

  await connectToDatabase();
  const ticket = await EventTicket.findOne({ code: code.toUpperCase() }).lean();
  if (!ticket || String(ticket.userId) !== user.id) notFound();

  const event = await Event.findById(ticket.eventId).lean();
  if (!event) notFound();

  const category = categoryBySlug(String(event.category));
  const ink = `var(--ch-${category?.token ?? "anime"})`;
  const start = new Date(event.startsAt as Date);

  // A request that has not been approved is not a pass, and must not look
  // like one — there is nothing here to print or show at a door yet.
  if (ticket.status !== "confirmed") {
    const pending = ticket.status === "pending";
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <span
          className="mx-auto grid h-14 w-14 place-items-center rounded-2xl text-[var(--void)]"
          style={{ background: ink }}
        >
          <Hourglass className="h-6 w-6" aria-hidden />
        </span>
        <h1 className="mt-6 font-display text-[clamp(1.4rem,4vw,2rem)] font-black leading-tight">
          {pending
            ? "This request is still with an editor"
            : "This pass is no longer valid"}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[0.95rem] leading-relaxed text-[var(--ink-soft)]">
          {pending
            ? `Your request for ${event.title} has not been approved yet. The stub appears here as soon as it is.`
            : `Your request for ${event.title} was ${
                ticket.status === "rejected" ? "not approved" : "withdrawn"
              }.`}
          {ticket.decisionNote ? ` ${ticket.decisionNote}` : ""}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="sm">
            <Link href={`/events/${event.slug}`}>Back to the event</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/dashboard">Your desk</Link>
          </Button>
        </div>
      </div>
    );
  }

  // The QR encodes this page's own absolute URL, so scanning it at a door
  // opens the booking for whoever is checking — which is the only claim a QR
  // on a ticket should make. SVG so it stays sharp when the stub is printed.
  const host = (await headers()).get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const passUrl = `${protocol}://${host}/tickets/${ticket.code}`;
  const qr = await QRCode.toString(passUrl, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
  });

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href={`/events/${event.slug}`}
          className="group inline-flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[var(--ink-soft)] transition-colors hover:text-[var(--n2)]"
        >
          ← Back to the event
        </Link>
        <div className="flex flex-wrap gap-2">
          <PrintButton />
          <Button asChild size="sm" variant="outline">
            <a href={`/api/events/${event.slug}/calendar`}>
              <CalendarPlus className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Add to calendar
            </a>
          </Button>
        </div>
      </div>

      {/* The stub. `print-exact` opts this one element back into printing its
          backgrounds — the rest of the page is fine losing them, but a ticket
          with no accent band and a QR with no contrast is not worth printing. */}
      <article
        className="print-exact overflow-hidden rounded-[1.4rem] border bg-[var(--paper-2)]"
        style={{ borderColor: `color-mix(in oklch, ${ink} 45%, transparent)` }}
      >
        <div
          className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
          style={{ background: `color-mix(in oklch, ${ink} 16%, transparent)` }}
        >
          <Image
            src="/brand/fanhub-plus-logo.webp"
            alt="Fan Hub Plus"
            width={1568}
            height={1020}
            className="h-11 w-auto rounded-md"
          />
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[var(--ink-faint)]">
            Event pass · {category?.name}
          </p>
        </div>

        <div className="grid gap-7 px-6 py-7 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <h1 className="font-display text-[clamp(1.3rem,3.6vw,1.95rem)] font-black leading-[1.04]">
              {String(event.title)}
            </h1>

            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <Detail
                icon={CalendarDays}
                label="Date"
                value={longDate(start)}
                ink={ink}
              />
              <Detail
                icon={Clock}
                label="Doors"
                value={time(start)}
                ink={ink}
              />
              <Detail
                icon={MapPin}
                label="Where"
                value={`${event.venue ? `${event.venue}, ` : ""}${event.city}`}
                ink={ink}
              />
              <Detail
                icon={UserRound}
                label="Admit"
                value={String(ticket.holderName) || user.name}
                ink={ink}
              />
            </dl>
          </div>

          {/* The counterfoil: the part someone actually holds up at a door. */}
          <div className="flex shrink-0 flex-col items-center justify-center gap-3 border-t border-dashed border-[var(--edge-strong)] pt-6 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
            <div
              className="rounded-xl bg-white p-2.5 [&>svg]:h-[8.5rem] [&>svg]:w-[8.5rem]"
              dangerouslySetInnerHTML={{ __html: qr }}
            />
            <div className="text-center">
              <p className="font-mono text-[0.52rem] uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                Booking code
              </p>
              <p
                className="mt-1.5 font-mono text-[0.98rem] font-bold tracking-[0.12em]"
                style={{ color: ink }}
              >
                {String(ticket.code)}
              </p>
            </div>
          </div>
        </div>

        <p className="border-t border-[var(--rule)] px-6 py-3.5 font-mono text-[0.56rem] leading-relaxed text-[var(--ink-faint)]">
          Academic project build — this pass is a demonstration and admits
          nobody to a real event. Scanning the code opens this booking.
        </p>
      </article>

      <p className="mt-6 text-center text-[0.84rem] text-[var(--ink-soft)] print:hidden">
        Use your browser&rsquo;s print dialog to save this as a PDF.{" "}
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-[var(--n2)]"
        >
          Event details
          <ArrowUpRight className="h-3 w-3" aria-hidden />
        </Link>
      </p>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
  ink,
}: {
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  label: string;
  value: string;
  ink: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-2 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
        <Icon className="h-3.5 w-3.5" style={{ color: ink }} />
        {label}
      </dt>
      <dd className="mt-2 font-display text-[0.95rem] font-bold leading-snug">
        {value}
      </dd>
    </div>
  );
}
