import type { Metadata } from "next";

import { connectToDatabase } from "@/lib/db";
import { CharacterProfile } from "@/models";
import { CATEGORIES, categoryBySlug } from "@/lib/constants";
import { Misreg } from "@/components/press";
import {
  ResourceManager,
  type FieldSpec,
} from "@/components/admin/resource-manager";

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
  { name: "kanji", label: "Name in original script", half: true },
  { name: "role", label: "Role", hint: "e.g. Sorcerer · Mentor", half: true },
  { name: "grade", label: "Grade", hint: "e.g. Special Grade", half: true },
  {
    name: "sealMark",
    label: "Seal glyph",
    hint: "One or two characters.",
    half: true,
  },
  {
    name: "accent",
    label: "Accent colour",
    hint: "Hex. Floods this character's page; blank falls back to the channel.",
    half: true,
  },
  { name: "affiliation", label: "Affiliation", half: true },
  { name: "status", label: "Status", half: true },
  { name: "troops", label: "Troops", half: true },
  { name: "relationships", label: "Relationships", hint: "Comma separated." },
  { name: "skills", label: "Skills", hint: "Comma separated." },
  { name: "weapons", label: "Weapons & EQS", hint: "Comma separated." },
  { name: "traits", label: "Traits", hint: "Comma separated." },
  { name: "bio", label: "Biography", kind: "textarea" },
];

export default async function AdminCharactersPage() {
  await connectToDatabase();
  const docs = await CharacterProfile.find()
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  const rows = docs.map((doc) => {
    const category = categoryBySlug(doc.category);
    return {
      id: String(doc._id),
      title: doc.name,
      meta: `${category?.name ?? doc.category} · ${doc.franchise || "—"} · ${doc.grade || "no grade"}`,
      // The row is marked in the character's own accent, so the list reads the
      // same way the profile pages do.
      ink: doc.accent || `var(--ch-${category?.token ?? "anime"})`,
      values: {
        name: doc.name,
        category: doc.category,
        franchise: doc.franchise ?? "",
        imageUrl: doc.imageUrl ?? "",
        kanji: doc.kanji ?? "",
        role: doc.role ?? "",
        grade: doc.grade ?? "",
        sealMark: doc.sealMark ?? "",
        accent: doc.accent ?? "",
        affiliation: doc.affiliation ?? "",
        status: doc.status ?? "",
        troops: doc.troops ?? "",
        relationships: (doc.relationships ?? []).join(", "),
        skills: (doc.skills ?? []).join(", "),
        weapons: (doc.weapons ?? []).join(", "),
        traits: (doc.traits ?? []).join(", "),
        bio: doc.bio ?? "",
      },
    };
  });

  return (
    <div>
      <div className="mb-8 border-t border-[var(--rule-strong)] pt-4">
        <p className="mark mb-3">Profile cards</p>
        <Misreg
          as="h1"
          className="text-[clamp(1.7rem,4.2vw,2.6rem)]"
          ghostInk="var(--ch-kpop)"
        >
          Characters
        </Misreg>
      </div>

      <ResourceManager
        kind="character"
        rows={rows}
        fields={FIELDS}
        singular="character"
      />
    </div>
  );
}
