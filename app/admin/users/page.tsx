import type { Metadata } from "next";

import { connectToDatabase } from "@/lib/db";
import { User, ActivityLog } from "@/models";
import { requireAdmin } from "@/lib/dal";
import { Misreg } from "@/components/press";
import { UserRow } from "@/components/admin/user-row";
import { formatDate, relativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Users · Admin" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const admin = await requireAdmin();
  await connectToDatabase();

  const docs = await User.find().sort({ createdAt: -1 }).limit(200).lean();

  // One aggregate for everyone's last activity, rather than a query per row.
  const lastSeen = await ActivityLog.aggregate<{ _id: unknown; at: Date }>([
    { $sort: { createdAt: -1 } },
    { $group: { _id: "$userId", at: { $first: "$createdAt" } } },
  ]);
  const seenMap = new Map(lastSeen.map((row) => [String(row._id), row.at]));

  const users = docs.map((doc) => {
    const seen = seenMap.get(String(doc._id));
    return {
      id: String(doc._id),
      name: doc.name,
      email: doc.email,
      role: doc.role ?? "user",
      avatarUrl: doc.avatarUrl ?? "",
      verified: Boolean(doc.emailVerifiedAt),
      joined: formatDate(doc.createdAt),
      lastSeen: seen ? relativeTime(seen) : "never",
      channels: (doc.favoriteCategories ?? []).length,
      isSelf: String(doc._id) === admin.id,
    };
  });

  const counts = users.reduce<Record<string, number>>((acc, user) => {
    acc[user.role] = (acc[user.role] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-8 border-t border-[var(--rule-strong)] pt-4">
        <p className="mark mb-3">
          {users.length} members · {counts.admin ?? 0} admin · {counts.user ?? 0} user ·{" "}
          {counts.visitor ?? 0} visitor
        </p>
        <Misreg as="h1" className="text-[clamp(1.7rem,4.2vw,2.6rem)]" ghostInk="var(--ch-manga)">
          Users
        </Misreg>
        <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-[var(--ink-soft)]">
          Roles decide what each member can reach. You cannot change your own role — that would
          make it possible to lock every administrator out in a single click.
        </p>
      </div>

      <ul className="border-t border-[var(--rule-strong)]">
        {users.map((user) => (
          <UserRow key={user.id} user={user} />
        ))}
      </ul>
    </div>
  );
}
