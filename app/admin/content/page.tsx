import type { Metadata } from "next";

import { connectToDatabase } from "@/lib/db";
import { Content } from "@/models";
import { CATEGORIES, CONTENT_TYPES, categoryBySlug } from "@/lib/constants";
import { Misreg } from "@/components/press";
import { ResourceManager, type FieldSpec } from "@/components/admin/resource-manager";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Content · Admin" };
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
    label: "Format",
    kind: "select",
    required: true,
    half: true,
    options: CONTENT_TYPES.map((t) => ({ value: t, label: t })),
  },
  { name: "summary", label: "Summary", kind: "textarea" },
  {
    name: "body",
    label: "Body",
    kind: "textarea",
    hint: "Plain paragraphs separated by a blank line, or HTML if you prefer.",
  },
  { name: "coverImage", label: "Cover image URL", half: true },
  { name: "mediaUrl", label: "Media URL (video/audio)", half: true },
  { name: "genre", label: "Genres", half: true, hint: "Comma separated." },
  {
    name: "mediaTags",
    label: "Media tags",
    half: true,
    hint: "Comma separated, e.g. Trailer, Breakdown.",
  },
  {
    name: "status",
    label: "Status",
    kind: "select",
    required: true,
    half: true,
    options: [
      { value: "published", label: "Published" },
      { value: "draft", label: "Draft" },
    ],
  },
];

export default async function AdminContentPage() {
  await connectToDatabase();
  const docs = await Content.find().sort({ createdAt: -1 }).limit(200).lean();

  const rows = docs.map((doc) => {
    const category = categoryBySlug(doc.category);
    return {
      id: String(doc._id),
      title: doc.title,
      meta: `${category?.name ?? doc.category} · ${doc.type} · ${doc.status} · ${formatDate(doc.releaseDate)} · ${(doc.viewCount ?? 0).toLocaleString()} views`,
      ink: `var(--ch-${category?.token ?? "anime"})`,
      values: {
        title: doc.title,
        category: doc.category,
        type: doc.type,
        summary: doc.summary ?? "",
        body: doc.body ?? "",
        coverImage: doc.coverImage ?? "",
        mediaUrl: doc.mediaUrl ?? "",
        genre: (doc.genre ?? []).join(", "),
        mediaTags: (doc.mediaTags ?? []).join(", "),
        status: doc.status ?? "published",
      },
    };
  });

  return (
    <div>
      <div className="mb-8 border-t-2 border-[var(--ink)] pt-4">
        <p className="mark mb-3">Articles, video, audio and galleries</p>
        <Misreg as="h1" className="text-[clamp(2rem,5vw,3.2rem)]" ghostInk="var(--ch-anime)">
          Content
        </Misreg>
      </div>

      <ResourceManager kind="content" rows={rows} fields={FIELDS} singular="piece" />
    </div>
  );
}
