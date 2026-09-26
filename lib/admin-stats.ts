import "server-only";
import { connectToDatabase } from "@/lib/db";
import {
  User,
  Content,
  CharacterProfile,
  MerchandiseItem,
  Event,
  Feedback,
  FanSubmission,
  ActivityLog,
  ChatbotQuery,
  Rating,
  Bookmark,
} from "@/models";
import { CATEGORIES } from "@/lib/constants";

/**
 * Usage statistics for the admin control panel (SRS FR-11).
 *
 * "Active users" means members with logged activity in the last 30 days,
 * derived from the ActivityLog rather than a `lastLoginAt` field — a member
 * who signed in six weeks ago and has read nothing since is not active, and
 * the login timestamp alone cannot tell the difference.
 */

export type AdminStats = {
  totals: {
    users: number;
    content: number;
    characters: number;
    merch: number;
    events: number;
    bookmarks: number;
    ratings: number;
  };
  activeUsers: { last7: number; last30: number };
  pending: { submissions: number; feedback: number };
  chatbot: { totalMessages: number; last30: number };
  categories: { slug: string; name: string; token: string; count: number; views: number }[];
  topContent: { title: string; slug: string; views: number; rating: number }[];
  recentActivity: { label: string; action: string; at: string }[];
};

function daysAgo(days: number) {
  return new Date(Date.now() - days * 86_400_000);
}

export async function getAdminStats(): Promise<AdminStats> {
  await connectToDatabase();

  const [
    users,
    content,
    characters,
    merch,
    events,
    bookmarks,
    ratings,
    active7,
    active30,
    pendingSubmissions,
    openFeedback,
    chatbotTotal,
    chatbot30,
    byCategory,
    topContent,
    recent,
  ] = await Promise.all([
    User.countDocuments(),
    Content.countDocuments({ status: "published" }),
    CharacterProfile.countDocuments(),
    MerchandiseItem.countDocuments(),
    Event.countDocuments(),
    Bookmark.countDocuments(),
    Rating.countDocuments(),

    // distinct() on a filtered set is the cheapest way to count unique actors.
    ActivityLog.distinct("userId", { createdAt: { $gte: daysAgo(7) } }),
    ActivityLog.distinct("userId", { createdAt: { $gte: daysAgo(30) } }),

    FanSubmission.countDocuments({ status: "pending" }),
    Feedback.countDocuments({ status: { $ne: "resolved" } }),

    ChatbotQuery.countDocuments(),
    ChatbotQuery.countDocuments({ createdAt: { $gte: daysAgo(30) } }),

    Content.aggregate<{ _id: string; count: number; views: number }>([
      { $match: { status: "published" } },
      { $group: { _id: "$category", count: { $sum: 1 }, views: { $sum: "$viewCount" } } },
      { $sort: { views: -1 } },
    ]),

    Content.find({ status: "published" })
      .sort({ viewCount: -1 })
      .limit(8)
      .select("title slug viewCount ratingSum ratingCount")
      .lean(),

    ActivityLog.find().sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  const categoryStats = CATEGORIES.map((category) => {
    const row = byCategory.find((entry) => entry._id === category.slug);
    return {
      slug: category.slug,
      name: category.name,
      token: category.token,
      count: row?.count ?? 0,
      views: row?.views ?? 0,
    };
  }).sort((a, b) => b.views - a.views);

  return {
    totals: { users, content, characters, merch, events, bookmarks, ratings },
    activeUsers: { last7: active7.length, last30: active30.length },
    pending: { submissions: pendingSubmissions, feedback: openFeedback },
    chatbot: { totalMessages: chatbotTotal, last30: chatbot30 },
    categories: categoryStats,
    topContent: topContent.map((item) => ({
      title: item.title,
      slug: item.slug,
      views: item.viewCount ?? 0,
      rating: item.ratingCount ? (item.ratingSum ?? 0) / item.ratingCount : 0,
    })),
    recentActivity: recent.map((entry) => ({
      label: entry.label || entry.action,
      action: entry.action,
      at: entry.createdAt?.toISOString() ?? new Date().toISOString(),
    })),
  };
}
