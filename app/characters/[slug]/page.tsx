import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { categoryBySlug } from "@/lib/constants";
import { connectToDatabase } from "@/lib/db";
import { CharacterProfile } from "@/models";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ShareButton } from "@/components/share-button";
import { BookmarkButton } from "@/components/bookmark-button";
import { isBookmarked } from "@/app/actions/bookmarks";
import { getCurrentUser } from "@/lib/dal";

export const dynamic = "force-dynamic";

async function getCharacter(slug: string) {
  await connectToDatabase();
  return CharacterProfile.findOne({ slug }).lean();
}

export async function generateMetadata(
  props: PageProps<"/characters/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const character = await getCharacter(slug);
  if (!character) return { title: "Character not found" };
  return {
    title: `${character.name} — ${character.franchise}`,
    description: character.bio?.slice(0, 160),
  };
}

export default async function CharacterDetailPage(
  props: PageProps<"/characters/[slug]">,
) {
  const { slug } = await props.params;
  const character = await getCharacter(slug);
  if (!character) notFound();

  const category = categoryBySlug(character.category);

  // Others from the same franchise, which is usually the most useful next step.
  await connectToDatabase();
  const [siblings, user, clipped] = await Promise.all([
    CharacterProfile.find({ franchise: character.franchise, slug: { $ne: slug } })
      .limit(4)
      .lean(),
    getCurrentUser(),
    isBookmarked("character", String(character._id)),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <Breadcrumbs
        trail={[
          { href: "/characters", label: "Characters" },
          { href: `/characters?category=${character.category}`, label: category?.name ?? "" },
          { label: character.name },
        ]}
      />

      <div className="grid gap-10 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        {/* Portrait card */}
        <div className="relative aspect-[4/5] overflow-hidden border-[1.5px] border-[var(--rule-strong)] bg-[var(--paper-2)]">
          {character.imageUrl && (
            <Image
              src={character.imageUrl}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover"
            />
          )}
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-color"
            style={{ background: `var(--ch-${category?.token ?? "anime"})` }}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"
          />
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-1"
            style={{ background: `var(--ch-${category?.token ?? "anime"})` }}
          />
        </div>

        <div>
          <p className="mark mb-4">
            <span style={{ color: `var(--ch-${category?.token ?? "anime"})` }}>
              {category?.name}
            </span>{" "}
            · {character.franchise}
            {character.debutYear ? ` · debut ${character.debutYear}` : ""}
          </p>

          <h1 className="font-display text-[clamp(2rem,5vw,3rem)]">{character.name}</h1>

          <div className="mt-4 flex flex-wrap gap-2">
            {(character.traits ?? []).map((trait) => (
              <span
                key={trait}
                className="border-[1.5px] border-[var(--rule-strong)] px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.11em] text-[var(--ink-soft)]"
              >
                {trait}
              </span>
            ))}
          </div>

          <p className="mt-7 text-[1.04rem] leading-relaxed text-[var(--ink)]">{character.bio}</p>

          <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-[var(--rule)] pt-6">
            <Link
              href={`/category/${character.category}`}
              className="font-mono text-[0.74rem] uppercase tracking-[0.12em] text-[var(--ink-soft)] transition-colors hover:text-[var(--spot)]"
            >
              Browse {category?.name}
            </Link>
            <BookmarkButton
              targetType="character"
              targetId={String(character._id)}
              initialBookmarked={clipped}
              signedIn={Boolean(user)}
            />
            <ShareButton title={character.name} />
          </div>

          <p className="mt-6 text-[0.78rem] leading-relaxed text-[var(--ink-faint)]">
            Card art is licensed stock photography under a channel-hue treatment, not official
            character artwork.
          </p>
        </div>
      </div>

      {siblings.length > 0 && (
        <section className="mt-16 border-t border-[var(--rule)] pt-12">
          <h2 className="mb-6 font-display text-[1.4rem]">
            Also from {character.franchise}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {siblings.map((sibling) => (
              <Link
                key={String(sibling._id)}
                href={`/characters/${sibling.slug}`}
                className="group border-[1.5px] border-[var(--rule-strong)] bg-[var(--paper)] p-4 transition-colors hover:border-[var(--rule-strong)]"
              >
                <h3 className="font-display text-[1rem] font-bold transition-colors group-hover:text-[var(--spot)]">
                  {sibling.name}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-[0.82rem] leading-relaxed text-[var(--ink-soft)]">
                  {sibling.bio}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
