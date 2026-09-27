import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { requireUser } from "@/lib/dal";
import { ProfileForm } from "@/components/profile/profile-form";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Profile & preferences" };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
          <li>
            <Link href="/dashboard" className="transition-colors hover:text-[var(--spot)]">
              Dashboard
            </Link>
          </li>
          <ChevronRight className="h-3 w-3" aria-hidden />
          <li className="text-[var(--ink)]">Profile</li>
        </ol>
      </nav>

      <header className="mb-10">
        <h1 className="font-display text-[clamp(1.65rem,4.2vw,2.3rem)]">Profile & preferences</h1>
        <p className="mt-3 text-[0.96rem] text-[var(--ink-soft)]">
          Member since {formatDate(user.createdAt)}
          {user.emailVerified ? " · email confirmed" : " · email not yet confirmed"}
        </p>
      </header>

      <ProfileForm user={user} />
    </div>
  );
}
