import type { Metadata } from "next";

import { connectToDatabase } from "@/lib/db";
import { Event } from "@/models";
import { CATEGORIES, EVENT_TYPES, categoryBySlug } from "@/lib/constants";
import { Misreg } from "@/components/press";
import { ResourceManager, type FieldSpec } from "@/components/admin/resource-manager";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Events · Admin" };
export const dynamic = "force-dynamic";

const FIELDS: FieldSpec[] = [
  { name: "title", label: "Title", required: true },
  {
    name: "category",
    label: "Channel",
    kind: "select",
    required: true,
    half: true,
    options: CATEGORIES.map((c) => ({ value: c.slug, label: c.name })),
  },
  {
    name: "type",
    label: "Kind",
    kind: "select",
    required: true,
    half: true,
    options: EVENT_TYPES.map((t) => ({ value: t, label: t })),
  },
  { name: "venue", label: "Venue", half: true },
  { name: "city", label: "City", required: true, half: true },
  { name: "country", label: "Country", half: true },
  { name: "startsAt", label: "Starts", kind: "datetime", required: true, half: true },
  {
    name: "lat",
    label: "Latitude",
    kind: "number",
    required: true,
    half: true,
    hint: "−90 to 90.",
  },
  {
    name: "lng",
    label: "Longitude",
    kind: "number",
    required: true,
    half: true,
    hint: "−180 to 180.",
  },
  { name: "ticketUrl", label: "Ticket link" },
  { name: "description", label: "Description", kind: "textarea" },
];

/** `datetime-local` needs `YYYY-MM-DDTHH:mm`, not an ISO string with a zone. */
function toLocalInput(date: Date | null | undefined) {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default async function AdminEventsPage() {
  await connectToDatabase();
  const docs = await Event.find().sort({ startsAt: 1 }).limit(200).lean();

  const rows = docs.map((doc) => {
    const category = categoryBySlug(doc.category);
    const coordinates = (doc.location?.coordinates ?? [0, 0]) as number[];
    return {
      id: String(doc._id),
      title: doc.title,
      meta: `${category?.name ?? doc.category} · ${doc.type} · ${doc.city} · ${formatDate(doc.startsAt)}`,
      ink: `var(--ch-${category?.token ?? "anime"})`,
      values: {
        title: doc.title,
        category: doc.category,
        type: doc.type,
        venue: doc.venue ?? "",
        city: doc.city,
        country: doc.country ?? "",
        startsAt: toLocalInput(doc.startsAt),
        // Stored as GeoJSON [lng, lat]; the form asks for them separately.
        lat: String(coordinates[1] ?? 0),
        lng: String(coordinates[0] ?? 0),
        ticketUrl: doc.ticketUrl ?? "",
        description: doc.description ?? "",
      },
    };
  });

  return (
    <div>
      <div className="mb-8 border-t border-[var(--rule-strong)] pt-4">
        <p className="mark mb-3">Conventions, meetups, screenings</p>
        <Misreg as="h1" className="text-[clamp(1.7rem,4.2vw,2.6rem)]" ghostInk="var(--ch-tv)">
          Events
        </Misreg>
      </div>

      <ResourceManager kind="event" rows={rows} fields={FIELDS} singular="event" />
    </div>
  );
}
