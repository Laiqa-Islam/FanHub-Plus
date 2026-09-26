"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Shield,
  PenLine,
  Scissors,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { CATEGORIES } from "@/lib/constants";
import { cn, initials } from "@/lib/utils";
import { InkStrip } from "@/components/press";
import { AccessibilityMenu } from "@/components/layout/accessibility-menu";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";
import type { CurrentUser } from "@/lib/dal";

const NAV_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/media", label: "Multimedia" },
  { href: "/characters", label: "Characters" },
  { href: "/events", label: "Events" },
  { href: "/merch", label: "Merch" },
  { href: "/upcoming", label: "Upcoming" },
];

/** The masthead bar: a printed banner, ruled off from the page below it. */
export function SiteHeader({ user }: { user: CurrentUser | null }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-[var(--ink)] bg-[var(--paper)]">
      <div className="mx-auto flex h-16 max-w-[88rem] items-center gap-6 px-5 sm:px-8">
        <Link href="/" className="group flex shrink-0 items-baseline gap-1.5">
          <span className="font-display text-[1.7rem] uppercase leading-none tracking-tight">
            Fan Hub
          </span>
          <span
            className="grid h-5 w-5 place-items-center bg-[var(--spot)] font-mono text-[0.8rem] font-bold leading-none text-white transition-transform duration-200 group-hover:rotate-12"
            aria-hidden
          >
            +
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          <ChannelMenu pathname={pathname} />
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors",
                  active ? "text-[var(--ink)]" : "text-[var(--ink-soft)] hover:text-[var(--ink)]",
                )}
              >
                {link.label}
                {/* Active state is an underprint rule, not a pill. */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-[3px] bg-[var(--spot)] transition-all duration-200",
                    active ? "w-full" : "w-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <AccessibilityMenu />

          {user ? (
            <AccountMenu user={user} />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Join</Link>
              </Button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="grid h-10 w-10 place-items-center border-[1.5px] border-[var(--ink)] lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <InkStrip height={5} />

      {mobileOpen && <MobileNav user={user} pathname={pathname} />}
    </header>
  );
}

function ChannelMenu({ pathname }: { pathname: string }) {
  const active = pathname.startsWith("/category");
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={cn(
            "relative font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors",
            active ? "text-[var(--ink)]" : "text-[var(--ink-soft)] hover:text-[var(--ink)]",
          )}
        >
          Channels
          <span
            aria-hidden
            className={cn(
              "absolute -bottom-1.5 left-0 h-[3px] bg-[var(--spot)] transition-all duration-200",
              active ? "w-full" : "w-0",
            )}
          />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={16}
          align="start"
          className="z-[70] w-[26rem] border-[1.5px] border-[var(--ink)] bg-[var(--paper)] p-0 shadow-[6px_6px_0_var(--ink)]"
        >
          {CATEGORIES.map((category, index) => (
            <DropdownMenu.Item key={category.slug} asChild>
              <Link
                href={`/category/${category.slug}`}
                className="group flex items-center gap-4 border-b border-[var(--rule)] px-4 py-2.5 outline-none transition-colors last:border-b-0 hover:bg-[var(--paper-2)] focus-visible:bg-[var(--paper-2)]"
              >
                <span className="w-5 font-mono text-[0.64rem] tabular-nums text-[var(--ink-faint)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden
                  className="h-4 w-4 shrink-0"
                  style={{ background: `var(--ch-${category.token})` }}
                />
                <span className="font-display text-[1.25rem] uppercase leading-none transition-transform duration-200 group-hover:translate-x-1">
                  {category.name}
                </span>
              </Link>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function AccountMenu({ user }: { user: CurrentUser }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden border-[1.5px] border-[var(--ink)] bg-[var(--paper-2)] font-mono text-[0.72rem] font-bold uppercase transition-shadow hover:shadow-[3px_3px_0_var(--spot)]"
        >
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            initials(user.name)
          )}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={12}
          align="end"
          className="z-[70] w-60 border-[1.5px] border-[var(--ink)] bg-[var(--paper)] shadow-[6px_6px_0_var(--ink)]"
        >
          <div className="border-b-[1.5px] border-[var(--ink)] bg-[var(--paper-2)] px-4 py-3">
            <p className="truncate font-display text-[1.15rem] uppercase leading-none">
              {user.name}
            </p>
            <p className="mt-1 truncate font-mono text-[0.62rem] text-[var(--ink-faint)]">
              {user.email}
            </p>
            {!user.emailVerified && (
              <Link
                href="/verify-email"
                className="mt-2 inline-block bg-[var(--flag)] px-2 py-0.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-white"
              >
                Confirm email
              </Link>
            )}
          </div>

          <MenuLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <MenuLink href="/bookmarks" icon={Scissors} label="Clippings" />
          <MenuLink href="/profile" icon={UserIcon} label="Profile" />
          <MenuLink href="/submit" icon={PenLine} label="Submit content" />
          {user.role === "admin" && (
            <MenuLink href="/admin/submissions" icon={Shield} label="Review queue" />
          )}

          <form action={logout} className="border-t-[1.5px] border-[var(--ink)]">
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 px-4 py-2.5 font-mono text-[0.68rem] uppercase tracking-[0.13em] text-[var(--ink-soft)] transition-colors hover:bg-[var(--spot)] hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden />
              Sign out
            </button>
          </form>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function MenuLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <DropdownMenu.Item asChild>
      <Link
        href={href}
        className="flex items-center gap-2.5 border-b border-[var(--rule)] px-4 py-2.5 font-mono text-[0.68rem] uppercase tracking-[0.13em] outline-none transition-colors hover:bg-[var(--paper-2)] focus-visible:bg-[var(--paper-2)]"
      >
        <Icon className="h-3.5 w-3.5 text-[var(--ink-faint)]" />
        {label}
      </Link>
    </DropdownMenu.Item>
  );
}

function MobileNav({ user, pathname }: { user: CurrentUser | null; pathname: string }) {
  return (
    <div className="border-t-2 border-[var(--ink)] bg-[var(--paper)] px-5 py-5 lg:hidden">
      <nav className="flex flex-col" aria-label="Mobile">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "border-b border-[var(--rule)] py-3 font-display text-[1.5rem] uppercase leading-none",
              pathname.startsWith(link.href) && "text-[var(--spot-deep)]",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <p className="mark mt-6 mb-3">Channels</p>
      <div className="grid grid-cols-2 gap-x-4">
        {CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="flex items-center gap-2.5 border-b border-[var(--rule)] py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.1em]"
          >
            <span
              aria-hidden
              className="h-3 w-3 shrink-0"
              style={{ background: `var(--ch-${category.token})` }}
            />
            {category.name}
          </Link>
        ))}
      </div>

      {!user && (
        <div className="mt-6 flex gap-2">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/register">Join</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
