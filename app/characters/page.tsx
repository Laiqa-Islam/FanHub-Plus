import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { CATEGORIES, categoryBySlug, CATEGORY_SLUGS } from "@/lib/constants";
import { connectToDatabase } from "@/lib/db";
import { CharacterProfile } from "@/models";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Reveal } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Character profiles",
  description:
    "Card-based character profiles across all eight fandom channels, filterable by channel and franchise.",
};

export const dynamic = "force-dynamic";

export default async function CharactersPage(props: PageProps<"/characters">) {
  const params = await props.searchParams;
  const rawCategory = Array.isArray(params.category) ? params.category[0] : params.category;
  const activeCategory = CATEGORY_SLUGS.includes(rawCategory as never) ? rawCategory! : "";

  const rawFranchise = Array.isArray(params.franchise) ? params.franchise[0] : params.franchise;
  const activeFranchise = (rawFranchise ?? "").slice(0, 60);

  await connectToDatabase();

  const filter: Record<string, unknown> = {};
  if (activeCategory) filter.category = activeCategory;
  if (activeFranchise) filter.franchise = activeFranchise;

  const [characters, franchises] = await Promise.all([
    CharacterProfile.find(filter as never)
      .sort({ popularityScore: -1, name: 1 })
      .lean(),
    CharacterProfile.distinct(
      "franchise",
      (activeCategory ? { category: activeCategory } : {}) as never,
    ) as unknown as Promise<string[]>,
  ]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <Breadcrumbs trail={[{ label: "Characters" }]} />

      <header className="mb-10 max-w-2xl">
        <p className="mark mb-3">Profiles · {characters.length} characters</p>
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)]">Character profiles</h1>
        <p className="mt-4 text-[1rem] leading-relaxed text-[var(--ink-soft)]">
          Who they are, what they&apos;re for, and why the writing works. Filter by channel or
          by franchise.
        </p>
      </header>

      {/* Channel filter */}
      <div className="mb-5 flex flex-wrap gap-2">
        <FilterChip href="/characters" active={!activeCategory} label="All channels" />
        {CATEGORIES.map((category) => (
          <FilterChip
            key={category.slug}
            href={`/characters?category=${category.slug}`}
            active={activeCategory === category.slug}
            label={category.name}
            dot={`var(--ch-${category.token})`}
          />
        ))}
      </div>

      {/* Franchise filter */}
      {franchises.length > 1 && (
        <div className="mb-10 flex flex-wrap gap-2">
          <FilterChip
            href={activeCategory ? `/characters?category=${activeCategory}` : "/characters"}
            active={!activeFranchise}
            label="All franchises"
            small
          />
          {franchises.filter(Boolean).sort().map((franchise) => {
            const query = new URLSearchParams();
            if (activeCategory) query.set("category", activeCategory);
            query.set("franchise", franchise);
            return (
              <FilterChip
                key={franchise}
                href={`/characters?${query.toString()}`}
                active={activeFranchise === franchise}
                label={franchise}
                small
              />
            );
          })}
        </div>
      )}

      {characters.length === 0 ? (
        <p className="border-[1.5px] border-dashed border-[var(--rule-strong)] px-6 py-16 text-center text-[var(--ink-soft)]">
          No character profiles match that filter yet.
        </p>
      ) : (
        <Reveal stagger={0.04} direction="scale" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {characters.map((character) => {
            const category = categoryBySlug(character.category);
            return (
              <TiltCard key={String(character._id)} className="reveal" intensity={7}>
                <Link
                  href={`/characters/${character.slug}`}
                  className="group flex h-full flex-col overflow-hidden border-[1.5px] border-[var(--rule-strong)] bg-[var(--paper)] transition-colors hover:border-[var(--rule-strong)]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[var(--paper-2)]">
                    {character.imageUrl && (
                      <Image
                        src={character.imageUrl}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}

                    {/* Channel-hue duotone. The art is atmospheric stock
                        photography, not official character art, and the wash
                        makes that read as a deliberate treatment. */}
                    <div
                      aria-hidden
                      className="absolute inset-0 mix-blend-color"
                      style={{ background: `var(--ch-${category?.token ?? "anime"})` }}
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent"
                    />

                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-white/70">
                        {character.franchise}
                      </p>
                      <h2 className="mt-1 font-display text-[1.15rem] font-extrabold leading-tight text-white">
                        {character.name}
                      </h2>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <p className="line-clamp-3 text-[0.84rem] leading-relaxed text-[var(--ink-soft)]">
                      {character.bio}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                      {(character.traits ?? []).slice(0, 2).map((trait) => (
                        <span
                          key={trait}
                          className="border-[1.5px] border-[var(--rule-strong)] px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-[var(--ink-faint)]"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </TiltCard>
            );
          })}
        </Reveal>
      )}
    </div>
  );
}

function FilterChip({
  href,
  active,
  label,
  dot,
  small = false,
}: {
  href: string;
  active: boolean;
  label: string;
  dot?: string;
  small?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 border transition-colors",
        small ? "px-3 py-1 text-[0.76rem]" : "px-3.5 py-1.5 text-[0.83rem]",
        active
          ? "border-[var(--spot)] bg-[var(--spot-wash)] text-[var(--spot-deep)]"
          : "border-[var(--rule)] text-[var(--ink-soft)] hover:border-[var(--rule-strong)] hover:text-[var(--ink)]",
      )}
    >
      {dot && <span aria-hidden className="h-2 w-2" style={{ background: dot }} />}
      {label}
    </Link>
  );
}
