import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { InkStrip, RegMark } from "@/components/press";

const COLUMNS = [
  {
    heading: "Read",
    links: [
      { href: "/explore", label: "Explore all" },
      { href: "/media", label: "Multimedia" },
      { href: "/characters", label: "Characters" },
      { href: "/events", label: "Events" },
      { href: "/merch", label: "Merch showcase" },
    ],
  },
  {
    heading: "Your account",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/bookmarks", label: "Bookmarks" },
      { href: "/profile", label: "Profile" },
      { href: "/submit", label: "Submit content" },
    ],
  },
  {
    heading: "Colophon",
    links: [
      { href: "/sitemap-page", label: "Sitemap" },
      { href: "/feedback", label: "Send feedback" },
      { href: "/upcoming", label: "Upcoming releases" },
      { href: "/events", label: "Events map" },
    ],
  },
];

/** The back cover: colophon, index and imprint. */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t-2 border-[var(--ink)] bg-[var(--paper-2)]">
      <InkStrip height={5} />

      <div className="mx-auto max-w-[88rem] px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="flex items-baseline gap-1.5">
              <span className="font-display text-[2rem] uppercase leading-none">Fan Hub</span>
              <span
                aria-hidden
                className="grid h-5 w-5 place-items-center bg-[var(--spot)] font-mono text-[0.8rem] font-bold leading-none text-white"
              >
                +
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[0.95rem] leading-relaxed text-[var(--ink-soft)]">
              Eight fandoms, printed in eight inks. Anime, gaming, film, television, K-Pop,
              comics, manga and cosplay — written up properly, in one place.
            </p>
            <RegMark className="mt-6 text-[var(--ink-faint)]" />
          </div>

          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <p className="mark mb-4 border-b border-[var(--rule)] pb-2">{column.heading}</p>
              <ul className="flex flex-col">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block border-b border-[var(--rule)] py-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[var(--ink-soft)] transition-colors hover:bg-[var(--paper-3)] hover:text-[var(--ink)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Channel index */}
        <div className="mt-12 border-t-2 border-[var(--ink)] pt-6">
          <p className="mark mb-4">Index of channels</p>
          <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((category, index) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group flex items-center gap-3 border-b border-[var(--rule)] py-2 transition-colors hover:bg-[var(--paper-3)]"
              >
                <span className="w-5 font-mono text-[0.62rem] tabular-nums text-[var(--ink-faint)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden
                  className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:scale-125"
                  style={{ background: `var(--ch-${category.token})` }}
                />
                <span className="font-display text-[1.15rem] uppercase leading-none">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[var(--rule)] pt-6 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-[var(--ink-faint)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Fan Hub Plus — academic project build</p>
          <p>Showcase only · no purchases, orders or payments</p>
        </div>
      </div>
    </footer>
  );
}
