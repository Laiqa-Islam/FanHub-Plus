import type { Metadata } from "next";

import { connectToDatabase } from "@/lib/db";
import { CharacterProfile } from "@/models";
import { CATEGORIES, categoryBySlug } from "@/lib/constants";
import { Misreg } from "@/components/press";
import { ResourceManager, type FieldSpec } from "@/components/admin/resource-manager";

export const metadata: Metadata = { title: "Characters · Admin" };
export const dynamic = "force-dynamic";

const FIELDS: FieldSpec[] = [
  { name: "name", label: "Name", required: true, half: true },
  {
    name: "category",
    label: "Channel",
    kind: "select",
    required: true,
    half: true,
    options: CATEGORIES.map((c) => ({ value: c.slug, label: c.name })),
  },
  { name: "franchise", label: "Franchise", half: true },
  { name: "imageUrl", label: "Image URL", half: true },
  { name: "traits", label: "Traits", hint: "Comma separated." },
  { name: "bio", label: "Biography", kind: "textarea" },
];

export default async function AdminCharactersPage() {
  await connectToDatabase();
  const docs = await CharacterProfile.find().sort({ createdAt: -1 }).limit(200).lean();

  const rows = docs.map((doc) => {
    const category = categoryBySlug(doc.category);
    return {
      id: String(doc._id),
      title: doc.name,
      meta: `${category?.name ?? doc.category} · ${doc.franchise || "—"} · ${(doc.traits ?? []).join(", ") || "no traits"}`,
      ink: `var(--ch-${category?.token ?? "anime"})`,
      values: {
        name: doc.name,
        category: doc.category,
        franchise: doc.franchise ?? "",
        imageUrl: doc.imageUrl ?? "",
        traits: (doc.traits ?? []).join(", "),
        bio: doc.bio ?? "",
      },
    };
  });

  return (
    <div>
      <div className="mb-8 border-t-2 border-[var(--ink)] pt-4">
        <p className="mark mb-3">Profile cards</p>
        <Misreg as="h1" className="text-[clamp(2rem,5vw,3.2rem)]" ghostInk="var(--ch-kpop)">
          Characters
        </Misreg>
      </div>

      <ResourceManager kind="character" rows={rows} fields={FIELDS} singular="character" />
    </div>
  );
}
