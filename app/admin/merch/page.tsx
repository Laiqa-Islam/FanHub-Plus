import type { Metadata } from "next";

import { connectToDatabase } from "@/lib/db";
import { MerchandiseItem } from "@/models";
import { CATEGORIES, MERCH_TAGS, categoryBySlug } from "@/lib/constants";
import { Misreg } from "@/components/press";
import {
  ResourceManager,
  type FieldSpec,
} from "@/components/admin/resource-manager";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Merch · Admin" };
export const dynamic = "force-dynamic";

const FIELDS: FieldSpec[] = [
  { name: "name", label: "Name", required: true },
  {
    name: "category",
    label: "Channel",
    kind: "select",
    required: true,
    half: true,
    options: CATEGORIES.map((c) => ({ value: c.slug, label: c.name })),
  },
  {
    name: "price",
    label: "Price (USD)",
    kind: "number",
    required: true,
    half: true,
    hint: "Example: 29.99",
  },
  {
    name: "tag",
    label: "Tag",
    kind: "select",
    required: true,
    half: true,
    options: MERCH_TAGS.map((t) => ({ value: t, label: t })),
  },
  { name: "imageUrl", label: "Image URL" },
  { name: "description", label: "Description", kind: "textarea" },
  { name: "isUpcoming", label: "Upcoming release", kind: "checkbox" },
];

export default async function AdminMerchPage() {
  await connectToDatabase();
  const docs = await MerchandiseItem.find()
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  const rows = docs.map((doc) => {
    const category = categoryBySlug(doc.category);
    return {
      id: String(doc._id),
      title: doc.name,
      meta: `${category?.name ?? doc.category} · $${((doc.priceCents ?? 0) / 100).toFixed(2)} · ${doc.tag} · ${doc.isUpcoming ? "upcoming" : "released"} ${formatDate(doc.releaseDate)} · ${(doc.viewCount ?? 0).toLocaleString()} views`,
      ink: `var(--ch-${category?.token ?? "anime"})`,
      values: {
        name: doc.name,
        category: doc.category,
        tag: doc.tag ?? "Collectible",
        price: ((doc.priceCents ?? 0) / 100).toFixed(2),
        imageUrl: doc.imageUrl ?? "",
        description: doc.description ?? "",
        isUpcoming: Boolean(doc.isUpcoming),
      },
    };
  });

  return (
    <div>
      <div className="mb-8 border-t border-[var(--rule-strong)] pt-4">
        <p className="mark mb-3">Store catalogue</p>
        <Misreg
          as="h1"
          className="text-[clamp(1.7rem,4.2vw,2.6rem)]"
          ghostInk="var(--ch-movies)"
        >
          Merchandise
        </Misreg>
      </div>

      <ResourceManager
        kind="merchandise"
        rows={rows}
        fields={FIELDS}
        singular="item"
      />
    </div>
  );
}
