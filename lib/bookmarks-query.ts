import "server-only";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import {
  Bookmark,
  Content,
  CharacterProfile,
  MerchandiseItem,
  Event,
} from "@/models";
import type { BookmarkTargetType } from "@/lib/bookmark-types";

/**
 * Resolves a member's bookmarks into displayable rows.
 *
 * Because bookmarks point at four different collections, this fetches the
 * bookmark rows once, then batches one query per collection rather than one
 * per bookmark — a saved list of forty items is five queries, not forty-one.
 * Targets that have since been deleted are dropped.
 */

export type ClippingRow = {
  bookmarkId: string;
  targetType: BookmarkTargetType;
  targetId: string;
  note: string;
  savedAt: string;
  title: string;
  href: string;
  category: string;
  summary: string;
  imageUrl: string;
  kindLabel: string;
};

const KIND_LABEL: Record<BookmarkTargetType, string> = {
  content: "Piece",
  character: "Character",
  merchandise: "Merch",
  event: "Event",
};

export async function getClippings(
  userId: string,
  filterType?: string,
): Promise<ClippingRow[]> {
  await connectToDatabase();

  const filter: Record<string, unknown> = { userId };
  if (filterType && filterType in KIND_LABEL) filter.targetType = filterType;

  const bookmarks = await Bookmark.find(filter as never)
    .sort({ createdAt: -1 })
    .lean();
  if (bookmarks.length === 0) return [];

  const idsByType = new Map<string, string[]>();
  for (const bookmark of bookmarks) {
    const list = idsByType.get(bookmark.targetType) ?? [];
    list.push(String(bookmark.targetId));
    idsByType.set(bookmark.targetType, list);
  }

  const [contents, characters, merch, events] = await Promise.all([
    Content.find({
      _id: { $in: idsByType.get("content") ?? [] },
    } as never).lean(),
    CharacterProfile.find({
      _id: { $in: idsByType.get("character") ?? [] },
    } as never).lean(),
    MerchandiseItem.find({
      _id: { $in: idsByType.get("merchandise") ?? [] },
    } as never).lean(),
    Event.find({ _id: { $in: idsByType.get("event") ?? [] } } as never).lean(),
  ]);

  const lookup = new Map<string, ClippingRow>();

  for (const doc of contents) {
    lookup.set(`content:${doc._id}`, {
      bookmarkId: "",
      targetType: "content",
      targetId: String(doc._id),
      note: "",
      savedAt: "",
      title: doc.title,
      href: `/content/${doc.slug}`,
      category: doc.category,
      summary: doc.summary ?? "",
      imageUrl: doc.coverImage ?? "",
      kindLabel: KIND_LABEL.content,
    });
  }
  for (const doc of characters) {
    lookup.set(`character:${doc._id}`, {
      bookmarkId: "",
      targetType: "character",
      targetId: String(doc._id),
      note: "",
      savedAt: "",
      title: doc.name,
      href: `/characters/${doc.slug}`,
      category: doc.category,
      summary: doc.bio ?? "",
      imageUrl: doc.imageUrl ?? "",
      kindLabel: KIND_LABEL.character,
    });
  }
  for (const doc of merch) {
    lookup.set(`merchandise:${doc._id}`, {
      bookmarkId: "",
      targetType: "merchandise",
      targetId: String(doc._id),
      note: "",
      savedAt: "",
      title: doc.name,
      href: `/merch/${doc.slug}`,
      category: doc.category,
      summary: doc.description ?? "",
      imageUrl: doc.imageUrl ?? "",
      kindLabel: KIND_LABEL.merchandise,
    });
  }
  for (const doc of events) {
    lookup.set(`event:${doc._id}`, {
      bookmarkId: "",
      targetType: "event",
      targetId: String(doc._id),
      note: "",
      savedAt: "",
      title: doc.title,
      href: `/events`,
      category: doc.category,
      summary: doc.description ?? "",
      imageUrl: doc.imageUrl ?? "",
      kindLabel: KIND_LABEL.event,
    });
  }

  // Preserve the newest-first order of the bookmarks themselves.
  return bookmarks.flatMap((bookmark) => {
    const row = lookup.get(`${bookmark.targetType}:${bookmark.targetId}`);
    if (!row) return []; // target was deleted since it was clipped
    return [
      {
        ...row,
        bookmarkId: String(bookmark._id),
        note: bookmark.note ?? "",
        savedAt: bookmark.createdAt?.toISOString() ?? new Date().toISOString(),
      },
    ];
  });
}

/** Counts per type, for the filter tabs. */
export async function getClippingCounts(userId: string) {
  await connectToDatabase();
  // $match in an aggregation pipeline does no schema casting, so the string
  // id has to be converted to an ObjectId by hand — unlike find(), which
  // would cast it for us.
  const rows = await Bookmark.aggregate<{ _id: string; count: number }>([
    { $match: { userId: Types.ObjectId.createFromHexString(userId) } },
    { $group: { _id: "$targetType", count: { $sum: 1 } } },
  ]);

  const counts: Record<string, number> = { all: 0 };
  for (const row of rows) {
    counts[row._id] = row.count;
    counts.all += row.count;
  }
  return counts;
}
