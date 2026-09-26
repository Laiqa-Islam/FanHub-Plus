import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import { InkStrip } from "@/components/press";
import { AdminNav } from "@/components/admin/admin-nav";

/**
 * Every admin route sits under this layout, which gates on the admin role.
 *
 * The gate is defence in depth rather than the only check: `proxy.ts` already
 * redirects non-admins away from `/admin`, and each server action calls
 * `requireAdmin()` itself. A layout alone would not be enough, because a
 * layout does not control whether its child routes render.
 */
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin();

  return (
    <div>
      <div className="border-b-2 border-[var(--ink)] bg-[var(--ink)]">
        <div className="mx-auto flex max-w-[92rem] flex-wrap items-center gap-x-6 gap-y-2 px-5 py-2.5 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-[var(--paper)] sm:px-8">
          <Link href="/admin" className="font-semibold">
            Control panel
          </Link>
          <span className="opacity-60">Signed in as {admin.name}</span>
          <Link href="/" className="ml-auto opacity-70 transition-opacity hover:opacity-100">
            ← Back to the site
          </Link>
        </div>
      </div>
      <InkStrip height={4} />

      <div className="mx-auto max-w-[92rem] px-5 py-8 sm:px-8">
        <AdminNav />
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
