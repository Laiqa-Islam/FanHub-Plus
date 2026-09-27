"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { connectToDatabase } from "@/lib/db";
import {
  Content,
  CharacterProfile,
  MerchandiseItem,
  Event,
  FaqEntry,
  User,
} from "@/models";
import { requireAdmin } from "@/lib/dal";
import { slugify } from "@/lib/utils";
import {
  CATEGORY_SLUGS,
  CONTENT_TYPES,
  MERCH_TAGS,
  EVENT_TYPES,
  ROLES,
} from "@/lib/constants";
import { parseEmbed, supportedProviderList } from "@/lib/embeds";
import { fieldErrors } from "@/lib/validation";
import type { FormState } from "@/app/actions/auth";

/**
 * Admin control panel writes (SRS FR-11).
 *
 * Every export calls `requireAdmin()` first. Server actions are public HTTP
 * endpoints — hiding the admin UI behind a role check in the page would do
 * nothing to stop a crafted POST, so authorisation is enforced here, at the
 * mutation, not in the component that renders the form.
 */

const RESOURCES = {
  content: { model: Content, path: "/admin/content", label: "Piece" },
  character: { model: CharacterProfile, path: "/admin/characters", label: "Character" },
  merchandise: { model: MerchandiseItem, path: "/admin/merch", label: "Item" },
  event: { model: Event, path: "/admin/events", label: "Event" },
  faq: { model: FaqEntry, path: "/admin/faq", label: "FAQ entry" },
} as const;

export type ResourceKind = keyof typeof RESOURCES;

// ── Schemas, one per resource ───────────────────────────────────────────────

const category = z.enum(CATEGORY_SLUGS as unknown as [string, ...string[]]);

const ContentSchema = z.object({
  title: z.string().trim().min(3, "Give it a title.").max(160),
  category,
  type: z.enum(CONTENT_TYPES as unknown as [string, ...string[]]),
  summary: z.string().trim().max(400).optional(),
  body: z.string().trim().max(40_000).optional(),
  coverImage: z.string().trim().max(600).optional(),
  mediaUrl: z.string().trim().max(600).optional(),
  genre: z.string().trim().max(200).optional(),
  // Admin-controlled media tagging (SRS FR-5).
  mediaTags: z.string().trim().max(200).optional(),
  /**
   * A platform link (v2 Phase 11). Entered as a URL for convenience, but stored
   * as provider + id — administrators get the same parser members do, and the
   * same guarantee that no URL from a form reaches an iframe.
   */
  embedUrl: z.string().trim().max(400).optional(),
  transcript: z.string().trim().max(30_000).optional(),
  status: z.enum(["draft", "published"]),
}).refine((data) => !data.embedUrl || parseEmbed(data.embedUrl) !== null, {
  // Without this an unrecognised link would store as an empty embed and the
  // piece would publish with no player, giving no hint as to why.
  message: `We can embed ${supportedProviderList()}. That link isn't one of them.`,
  path: ["embedUrl"],
});

const CharacterSchema = z.object({
  name: z.string().trim().min(2, "Give them a name.").max(120),
  category,
  franchise: z.string().trim().max(120).optional(),
  bio: z.string().trim().max(4000).optional(),
  imageUrl: z.string().trim().max(600).optional(),
  traits: z.string().trim().max(200).optional(),

  // The dossier fields the profile page is built around.
  kanji: z.string().trim().max(60).optional(),
  role: z.string().trim().max(120).optional(),
  grade: z.string().trim().max(80).optional(),
  sealMark: z.string().trim().max(8).optional(),
  accent: z.string().trim().max(40).optional(),
  affiliation: z.string().trim().max(200).optional(),
  status: z.string().trim().max(200).optional(),
  relationships: z.string().trim().max(600).optional(),
  skills: z.string().trim().max(600).optional(),
  troops: z.string().trim().max(200).optional(),
  weapons: z.string().trim().max(400).optional(),
});

const MerchSchema = z.object({
  name: z.string().trim().min(2, "Give it a name.").max(160),
  category,
  description: z.string().trim().max(2000).optional(),
  price: z.coerce.number().min(0, "Price cannot be negative.").max(100_000),
  imageUrl: z.string().trim().max(600).optional(),
  tag: z.enum(MERCH_TAGS as unknown as [string, ...string[]]),
  isUpcoming: z.coerce.boolean(),
});

const EventSchema = z.object({
  title: z.string().trim().min(3, "Give it a title.").max(160),
  category,
  type: z.enum(EVENT_TYPES as unknown as [string, ...string[]]),
  description: z.string().trim().max(2000).optional(),
  venue: z.string().trim().max(160).optional(),
  city: z.string().trim().min(2, "Which city?").max(120),
  country: z.string().trim().max(120).optional(),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  startsAt: z.string().min(1, "When does it start?"),
  ticketUrl: z.string().trim().max(600).optional(),
});

const FaqSchema = z.object({
  question: z.string().trim().min(5, "What's the question?").max(300),
  answer: z.string().trim().min(5, "What's the answer?").max(4000),
  tags: z.string().trim().max(200).optional(),
  isPublished: z.coerce.boolean(),
});

/** Splits a comma-separated field into a clean array. */
function toList(value?: string) {
  return (value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/** Maps validated form data onto the document shape for each resource. */
function buildDocument(kind: ResourceKind, data: Record<string, unknown>) {
  switch (kind) {
    case "content": {
      const d = data as z.infer<typeof ContentSchema>;
      const embed = d.embedUrl ? parseEmbed(d.embedUrl) : null;
      return {
        embedProvider: embed?.provider ?? "",
        embedId: embed?.id ?? "",
        transcript: d.transcript ?? "",
        title: d.title,
        slug: slugify(d.title),
        category: d.category,
        type: d.type,
        summary: d.summary ?? "",
        // Plain paragraphs typed by an admin are wrapped, but HTML they paste
        // is preserved — this field is only ever editable by administrators.
        body: d.body?.includes("<") ? d.body : `<p>${(d.body ?? "").replace(/\n{2,}/g, "</p><p>")}</p>`,
        coverImage: d.coverImage ?? "",
        mediaUrl: d.mediaUrl ?? "",
        genre: toList(d.genre),
        tags: toList(d.genre),
        mediaTags: toList(d.mediaTags),
        status: d.status,
      };
    }
    case "character": {
      const d = data as z.infer<typeof CharacterSchema>;
      return {
        name: d.name,
        slug: slugify(`${d.name}-${d.franchise ?? ""}`),
        category: d.category,
        franchise: d.franchise ?? "",
        bio: d.bio ?? "",
        imageUrl: d.imageUrl ?? "",
        traits: toList(d.traits),
        kanji: d.kanji ?? "",
        role: d.role ?? "",
        grade: d.grade ?? "",
        sealMark: d.sealMark ?? "",
        accent: d.accent ?? "",
        affiliation: d.affiliation ?? "",
        status: d.status ?? "",
        relationships: toList(d.relationships),
        skills: toList(d.skills),
        troops: d.troops ?? "",
        weapons: toList(d.weapons),
      };
    }
    case "merchandise": {
      const d = data as z.infer<typeof MerchSchema>;
      return {
        name: d.name,
        slug: slugify(d.name),
        category: d.category,
        description: d.description ?? "",
        priceCents: Math.round(d.price * 100),
        imageUrl: d.imageUrl ?? "",
        tag: d.tag,
        isUpcoming: d.isUpcoming,
      };
    }
    case "event": {
      const d = data as z.infer<typeof EventSchema>;
      return {
        title: d.title,
        slug: slugify(`${d.title}-${d.city}`),
        category: d.category,
        type: d.type,
        description: d.description ?? "",
        venue: d.venue ?? "",
        city: d.city,
        country: d.country ?? "",
        // GeoJSON stores [longitude, latitude] — the reverse of how the form
        // asks for it, and an easy thing to get backwards.
        location: { type: "Point", coordinates: [d.lng, d.lat] },
        startsAt: new Date(d.startsAt),
        ticketUrl: d.ticketUrl ?? "",
      };
    }
    case "faq": {
      const d = data as z.infer<typeof FaqSchema>;
      return {
        question: d.question,
        answer: d.answer,
        tags: toList(d.tags),
        isPublished: d.isPublished,
      };
    }
  }
}

function parse(kind: ResourceKind, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  // Unchecked boxes are simply absent from FormData.
  const withBooleans = {
    ...raw,
    isUpcoming: formData.get("isUpcoming") === "on",
    isPublished: formData.get("isPublished") === "on",
  };

  switch (kind) {
    case "content":
      return ContentSchema.safeParse(withBooleans);
    case "character":
      return CharacterSchema.safeParse(withBooleans);
    case "merchandise":
      return MerchSchema.safeParse(withBooleans);
    case "event":
      return EventSchema.safeParse(withBooleans);
    case "faq":
      return FaqSchema.safeParse(withBooleans);
  }
}

/** Creates or updates a record. An `id` field in the form means update. */
export async function saveResource(
  kind: ResourceKind,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const resource = RESOURCES[kind];
  if (!resource) return { message: "Unknown resource." };

  const parsed = parse(kind, formData);
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const id = String(formData.get("id") ?? "").trim();
  const document = buildDocument(kind, parsed.data as Record<string, unknown>);

  try {
    await connectToDatabase();
    const model = resource.model as unknown as {
      findByIdAndUpdate: (id: string, doc: unknown) => Promise<unknown>;
      create: (doc: unknown) => Promise<unknown>;
    };

    if (id) await model.findByIdAndUpdate(id, document);
    else await model.create(document);
  } catch (error) {
    if ((error as { code?: number }).code === 11000) {
      return { message: "Something with that title already exists — try a different one." };
    }
    console.error(`[admin] save ${kind} failed:`, error);
    return { message: "We couldn't save that. Please try again." };
  }

  revalidatePath(resource.path);
  revalidatePath("/admin");
  return { success: true, message: `${resource.label} saved.` };
}

/** Permanently removes a record. */
export async function deleteResource(
  kind: ResourceKind,
  id: string,
): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();

  const resource = RESOURCES[kind];
  if (!resource) return { ok: false, message: "Unknown resource." };

  try {
    await connectToDatabase();
    const model = resource.model as unknown as {
      findByIdAndDelete: (id: string) => Promise<unknown>;
    };
    await model.findByIdAndDelete(id);
  } catch (error) {
    console.error(`[admin] delete ${kind} failed:`, error);
    return { ok: false, message: "We couldn't delete that." };
  }

  revalidatePath(resource.path);
  revalidatePath("/admin");
  return { ok: true, message: `${resource.label} deleted.` };
}

/** Changes a member's role (SRS FR-11: user management). */
export async function setUserRole(
  userId: string,
  role: string,
): Promise<{ ok: boolean; message: string }> {
  const admin = await requireAdmin();

  if (!ROLES.includes(role as never)) {
    return { ok: false, message: "That role isn't recognised." };
  }
  // Without this an administrator can lock themselves — and potentially
  // everyone — out of the control panel in one click.
  if (userId === admin.id) {
    return { ok: false, message: "You can't change your own role." };
  }

  try {
    await connectToDatabase();
    await User.findByIdAndUpdate(userId, { role });
  } catch (error) {
    console.error("[admin] role change failed:", error);
    return { ok: false, message: "We couldn't change that role." };
  }

  revalidatePath("/admin/users");
  return { ok: true, message: `Role set to ${role}.` };
}
