"use client";

import { useState, useTransition } from "react";
import { toast } from "react-toastify";

import { setUserRole } from "@/app/actions/admin";
import { ROLES } from "@/lib/constants";
import { cn, initials } from "@/lib/utils";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  verified: boolean;
  joined: string;
  lastSeen: string;
  channels: number;
  isSelf: boolean;
};

/** Role management (SRS FR-11). */
export function UserRow({ user }: { user: AdminUser }) {
  const [role, setRole] = useState(user.role);
  const [isPending, startTransition] = useTransition();

  function change(next: string) {
    const previous = role;
    setRole(next);

    startTransition(async () => {
      const result = await setUserRole(user.id, next);
      if (result.ok) toast.success(result.message);
      else {
        setRole(previous);
        toast.error(result.message);
      }
    });
  }

  return (
    <li className="flex flex-wrap items-center gap-4 border-b border-[var(--rule)] py-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden border-[1.5px] border-[var(--ink)] bg-[var(--paper-2)] font-mono text-[0.68rem] font-bold uppercase">
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          initials(user.name)
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-[1.2rem] uppercase leading-none">
          {user.name}
          {user.isSelf && (
            <span className="ml-2 font-mono text-[0.58rem] tracking-[0.12em] text-[var(--spot-deep)]">
              you
            </span>
          )}
        </p>
        <p className="mt-1 truncate font-mono text-[0.62rem] uppercase tracking-[0.1em] text-[var(--ink-faint)]">
          {user.email} · joined {user.joined} · {user.channels} channels ·{" "}
          {user.verified ? "verified" : "unverified"} · seen {user.lastSeen}
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap">
        {ROLES.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => change(value)}
            // Self-demotion is blocked server-side too; disabling here just
            // avoids offering an action that will be refused.
            disabled={isPending || role === value || user.isSelf}
            aria-pressed={role === value}
            className={cn(
              "-ml-[1.5px] border-[1.5px] border-[var(--ink)] px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] transition-colors first:ml-0",
              role === value
                ? "bg-[var(--ink)] text-[var(--paper)]"
                : "bg-[var(--paper)] hover:bg-[var(--paper-2)]",
              user.isSelf && "cursor-not-allowed opacity-45",
            )}
          >
            {value}
          </button>
        ))}
      </div>
    </li>
  );
}
