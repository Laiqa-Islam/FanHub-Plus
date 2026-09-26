import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to reach your dashboard, bookmarks and the channels you follow."
      footer={
        <>
          New here?{" "}
          <Link
            href="/register"
            className="font-semibold text-[var(--spot)] underline-offset-4 hover:underline"
          >
            Create a free account
          </Link>
        </>
      }
    >
      {/* useSearchParams needs a Suspense boundary during prerender. */}
      <Suspense fallback={<div className="h-64" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
