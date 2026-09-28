import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, MailWarning } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";
import { ResendVerificationForm } from "@/components/auth/password-forms";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/dal";

export const metadata: Metadata = { title: "Confirm your email" };

export default async function VerifyEmailPage(
  props: PageProps<"/verify-email">,
) {
  const params = await props.searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  const user = await getCurrentUser();

  // No token means the user landed here from the header prompt rather than
  // from the emailed link.
  if (!token) {
    if (user?.emailVerified) return <AlreadyConfirmed />;

    return (
      <AuthShell
        title="Confirm your email"
        subtitle="We sent a link when you signed up. Can't find it? Request another below."
      >
        <ResendVerificationForm defaultEmail={user?.email ?? ""} />
      </AuthShell>
    );
  }

  const result = await verifyEmail(token);

  if (result.ok) {
    return (
      <AuthShell title="Email confirmed" subtitle={result.message}>
        <div className="flex items-start gap-3 border border-[var(--spot-2)]/35 bg-[var(--spot-2-wash)] p-5">
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-[var(--spot-2)]"
            aria-hidden
          />
          <p className="text-[0.9rem] leading-relaxed text-[var(--ink-soft)]">
            Bookmarks, fan submissions and your personalised dashboard are all
            unlocked.
          </p>
        </div>
        <Button asChild size="lg" className="mt-6 w-full">
          <Link href={user ? "/dashboard" : "/login?verified=1"}>
            {user ? "Go to dashboard" : "Sign in"}
          </Link>
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="That link didn't work" subtitle={result.message}>
      <div className="mb-6 flex items-start gap-3 border border-[var(--flag)]/35 bg-[var(--flag)]/10 p-5">
        <MailWarning
          className="mt-0.5 h-5 w-5 shrink-0 text-[var(--flag)]"
          aria-hidden
        />
        <p className="text-[0.9rem] leading-relaxed text-[var(--ink-soft)]">
          Confirmation links expire after an hour and can only be used once.
        </p>
      </div>
      <ResendVerificationForm defaultEmail={user?.email ?? ""} />
    </AuthShell>
  );
}

function AlreadyConfirmed() {
  return (
    <AuthShell
      title="You're all set"
      subtitle="This account's email is already confirmed — nothing left to do here."
    >
      <Button asChild size="lg" className="w-full">
        <Link href="/dashboard">Go to dashboard</Link>
      </Button>
    </AuthShell>
  );
}
