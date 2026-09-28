import Link from "next/link";
import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import {
  ResetPasswordForm,
  ForgotPasswordForm,
} from "@/components/auth/password-forms";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage(
  props: PageProps<"/reset-password">,
) {
  // searchParams is a Promise in Next 16.
  const params = await props.searchParams;
  const token = typeof params.token === "string" ? params.token : "";

  if (!token) {
    return (
      <AuthShell
        title="This link is incomplete"
        subtitle="The reset link is missing its token. Request a fresh one and we'll send another."
      >
        <ForgotPasswordForm />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Pick something you haven't used here before. You'll sign in again straight after."
      footer={
        <Link
          href="/login"
          className="font-semibold text-[var(--spot)] underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      }
    >
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
