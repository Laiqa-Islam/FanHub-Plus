import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { MailWarning, ShieldAlert, Sparkles, Bookmark, Compass, Activity } from "lucide-react";

import { requireUser } from "@/lib/dal";
import { connectToDatabase } from "@/lib/db";
import { ActivityLog, Content } from "@/models";
import { CATEGORIES, categoryBySlug, type CategorySlug } from "@/lib/constants";
import { getClippings, getClippingCounts } from "@/lib/bookmarks-query";
import { relativeTime, formatDate } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { InkStrip, Misreg, RegMark } from "@/components/press";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Your desk" };
export const dynamic = "force-dynamic";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage(props: PageProps<"/dashboard">) {
  const user = await requireUser();
  const params = await props.searchParams;

  await connectToDatabase();

  const [activity, clippings, counts, recommended] = await Promise.all([
    ActivityLog.find({ userId: user.id }).sort({ createdAt: -1 }).limit(7).lean(),
    getClippings(user.id).then((rows) => rows.slice(0, 4)),
    getClippingCounts(user.id),
    // Lead with the member's own channels; fall back to everything.
    Content.find({
      status: "published",
      ...(user.favoriteCategories.length > 0
        ? { category: { $in: user.favoriteCategories as CategorySlug[] } }
        : {}),
    })
      .sort({ popularityScore: -1, createdAt: -1 })
      .limit(6)
      .lean(),
  ]);

  const favorites = CATEGORIES.filter((c) => user.favoriteCategories.includes(c.slug));
  const firstName = user.name.split(" ")[0];

  return (
    <div>
      {/* Masthead — this issue is addressed to one reader */}
      <header className="border-b border-[var(--rule-strong)]">
        <div className="mx-auto max-w-[88rem] px-5 pb-8 pt-8 sm:px-8">
          <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-[var(--rule)] pb-3 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-[var(--ink-faint)]">
            <RegMark className="text-[var(--ink)]" />
            <span>{new Date().toDateString()}</span>
            <span>{user.role === "admin" ? "Editor" : "Subscriber"} edition</span>
            <span className="ml-auto text-[var(--spot-deep)]">Personal copy</span>
          </div>

          <p className="mark mb-3">{greeting()}</p>
          <Misreg as="h1" className="text-[clamp(1.9rem,5.5vw,3.5rem)]" ghostInk="var(--spot-2)">
            {firstName}
          </Misreg>
        </div>
        <InkStrip height={5} />
      </header>

      <div className="mx-auto max-w-[88rem] px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-3">
          {params.denied === "admin" && (
            <Notice
              icon={ShieldAlert}
              title="Admin area is restricted"
              body="That section needs an administrator account."
            />
          )}
          {!user.emailVerified && (
            <Notice
              icon={MailWarning}
              title="Confirm your email"
              body="Saves, ratings and submissions unlock once your address is verified."
              action={{ href: "/verify-email", label: "Send a link" }}
            />
          )}
          {params.welcome === "1" && (
            <Notice
              icon={Sparkles}
              title={`Welcome in, ${firstName}`}
              body="Pick your channels so this page opens on what you actually read."
              action={{ href: "/profile", label: "Choose channels" }}
            />
          )}
        </div>

        <Reveal
          stagger={0.06}
          className="mt-8 grid gap-2.5 sm:grid-cols-3"
        >
          <Stat label="Saved" value={counts.all ?? 0} href="/bookmarks" icon={Bookmark} />
          <Stat label="Channels followed" value={favorites.length} href="/profile" icon={Compass} />
          <Stat label="Recent actions" value={activity.length} icon={Activity} />
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <section>
            <div className="mb-6 flex items-end justify-between border-t border-[var(--rule-strong)] pt-3">
              <h2 className="font-display text-[1.44rem] leading-none">
                {favorites.length > 0 ? "From your channels" : "Most read"}
              </h2>
              <Link
                href="/explore"
                className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[var(--ink-soft)] transition-colors hover:text-[var(--spot-deep)]"
              >
                See all →
              </Link>
            </div>

            {recommended.length === 0 ? (
              <Empty
                title="Nothing published yet"
                body="Once content is seeded or added from the admin panel, it appears here."
                action={{ href: "/explore", label: "Open the explorer" }}
              />
            ) : (
              <Reveal stagger={0.05} className="flex flex-col">
                {recommended.map((item, index) => {
                  const category = categoryBySlug(item.category);
                  return (
                    <Link
                      key={String(item._id)}
                      href={`/content/${item.slug}`}
                      className="reveal group flex items-baseline gap-4 border-b border-[var(--rule)] py-3.5 transition-colors hover:bg-[var(--paper-2)]"
                    >
                      <span className="font-mono text-[0.62rem] tabular-nums text-[var(--ink-faint)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        aria-hidden
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                    background: `var(--ch-${category?.token ?? "anime"})`,
                    boxShadow: `0 0 9px var(--ch-${category?.token ?? "anime"})`,
                  }}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-[0.97rem] leading-[0.95] transition-transform duration-200 group-hover:translate-x-1">
                          {item.title}
                        </span>
                        <span className="mt-1 block font-mono text-[0.6rem] uppercase tracking-[0.13em] text-[var(--ink-faint)]">
                          {category?.name} · {item.type} · {formatDate(item.releaseDate)}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </Reveal>
            )}

            <div className="mt-12">
              <div className="mb-5 flex items-end justify-between border-t border-[var(--rule-strong)] pt-3">
                <h2 className="font-display text-[1.44rem] leading-none">
                  Recent clippings
                </h2>
                <Link
                  href="/bookmarks"
                  className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[var(--ink-soft)] transition-colors hover:text-[var(--spot-deep)]"
                >
                  Open file →
                </Link>
              </div>

              {clippings.length === 0 ? (
                <Empty
                  title="Nothing saved yet"
                  body="Hit the save mark on anything worth keeping and it lands in your file."
                  action={{ href: "/explore", label: "Find something" }}
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {clippings.map((row) => {
                    const category = categoryBySlug(row.category);
                    const ink = `var(--ch-${category?.token ?? "anime"})`;
                    return (
                      <Link
                        key={row.bookmarkId}
                        href={row.href}
                        className="group flex gap-3 rounded-2xl border border-[var(--edge)] bg-[var(--paper)] p-3 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[var(--lift-md)]"
                      >
                        <span className="relative h-16 w-16 shrink-0 overflow-hidden border border-[var(--edge)]">
                          {row.imageUrl && (
                            <Image
                              src={row.imageUrl}
                              alt=""
                              fill
                              sizes="64px"
                              className="plate object-cover"
                            />
                          )}
                          <span
                            aria-hidden
                            className="absolute inset-0 mix-blend-multiply dark:mix-blend-screen"
                            style={{ background: ink, opacity: 0.5 }}
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-mono text-[0.56rem] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                            {row.kindLabel}
                          </span>
                          <span className="mt-0.5 block font-display text-[0.95rem] leading-[0.98] group-hover:text-[var(--spot-deep)]">
                            {row.title}
                          </span>
                          {row.note && (
                            <span className="mt-1 block line-clamp-1 text-[0.78rem] italic text-[var(--ink-soft)]">
                              {row.note}
                            </span>
                          )}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <aside className="flex flex-col gap-10">
            <section>
              <h2 className="mb-4 border-t border-[var(--rule-strong)] pt-3 font-display text-[1.22rem] leading-none">
                Your channels
              </h2>
              {favorites.length === 0 ? (
                <Empty
                  title="No channels yet"
                  body="Follow the fandoms you care about and this page reshapes around them."
                  action={{ href: "/profile", label: "Pick channels" }}
                />
              ) : (
                <ul className="flex flex-col">
                  {favorites.map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={`/category/${category.slug}`}
                        className="group flex items-center gap-3 border-b border-[var(--rule)] py-2.5 transition-colors hover:bg-[var(--paper-2)]"
                      >
                        <span
                          aria-hidden
                          className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-125 rounded-full"
                          style={{
                    background: `var(--ch-${category.token})`,
                    boxShadow: `0 0 9px var(--ch-${category.token})`,
                  }}
                        />
                        <span className="font-display text-[0.95rem] leading-none">
                          {category.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h2 className="mb-4 border-t border-[var(--rule-strong)] pt-3 font-display text-[1.22rem] leading-none">
                Activity
              </h2>
              {activity.length === 0 ? (
                <p className="text-[0.9rem] text-[var(--ink-soft)]">
                  What you do here shows up in this column.
                </p>
              ) : (
                <ol className="flex flex-col">
                  {activity.map((entry) => (
                    <li
                      key={String(entry._id)}
                      className="flex items-baseline gap-3 border-b border-[var(--rule)] py-2"
                    >
                      <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-[var(--spot)]" />
                      <span className="min-w-0 flex-1 text-[0.9rem]">
                        {entry.label || entry.action}
                      </span>
                      <span className="shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-[var(--ink-faint)]">
                        {relativeTime(entry.createdAt)}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
  icon: Icon,
}: {
  label: string;
  value: number;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const inner = (
    <>
      <Icon className="h-4 w-4 text-[var(--spot)]" aria-hidden />
      <p className="mt-4 font-display text-[2.8rem] leading-none tabular-nums">{value}</p>
      <p className="mark mt-1 !text-[0.58rem]">{label}</p>
    </>
  );
  const className =
    "reveal rounded-2xl border border-[var(--edge)] bg-[var(--paper-3)] p-5 transition-colors hover:border-[var(--n2)]";

  return href ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <div className={className}>{inner}</div>
  );
}

function Empty({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="border border-dashed border-[var(--edge-strong)] p-6 text-center">
      <p className="font-display text-[0.95rem] leading-none">{title}</p>
      <p className="mx-auto mt-2.5 max-w-xs text-[0.88rem] leading-relaxed text-[var(--ink-soft)]">
        {body}
      </p>
      {action && (
        <Button asChild size="sm" variant="outline" className="mt-4">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}

function Notice({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--edge)] bg-[var(--paper-2)] p-4">
      <Icon className="h-5 w-5 shrink-0 text-[var(--flag)]" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="font-display text-[0.95rem] leading-none">{title}</p>
        <p className="mt-1.5 text-[0.88rem] text-[var(--ink-soft)]">{body}</p>
      </div>
      {action && (
        <Button asChild size="sm" variant="outline">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
