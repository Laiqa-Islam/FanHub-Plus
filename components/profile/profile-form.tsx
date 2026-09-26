"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Camera, Check } from "lucide-react";
import { toast } from "react-toastify";

import { updateProfile } from "@/app/actions/profile";
import { CATEGORIES } from "@/lib/constants";
import { cn, initials } from "@/lib/utils";
import { Input, Textarea, Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";
import type { CurrentUser } from "@/lib/dal";

export function ProfileForm({ user }: { user: CurrentUser }) {
  const [state, action, pending] = useActionState(updateProfile, undefined);
  const { setTheme, setFontScale, setReducedMotion } = useTheme();

  const [selected, setSelected] = useState<string[]>(user.favoriteCategories);
  const [preview, setPreview] = useState<string>(user.avatarUrl);
  const [fontScale, setLocalFontScale] = useState(user.preferences.fontScale);
  const [theme, setLocalTheme] = useState(user.preferences.theme);
  const [reducedMotion, setLocalReducedMotion] = useState(user.preferences.reducedMotion);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message ?? "Profile saved.");
      // Mirror the saved preferences into the live client theme so the page
      // reflects them without a reload.
      setTheme(theme as "light" | "dark" | "system");
      setFontScale(fontScale);
      setReducedMotion(reducedMotion);
    } else if (state?.message) {
      toast.error(state.message);
    }
    // Only react to a new action result, not to every local edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Local object URL preview, revoked when it is replaced.
  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview((old) => {
      if (old.startsWith("blob:")) URL.revokeObjectURL(old);
      return url;
    });
  }

  function toggleCategory(slug: string) {
    setSelected((current) =>
      current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug],
    );
  }

  return (
    <form action={action} className="flex flex-col gap-10">
      {/* Avatar */}
      <section>
        <h2 className="mb-5 font-display text-[1.3rem]">Profile picture</h2>
        <div className="flex flex-wrap items-center gap-6">
          <div className="relative">
            <div className="grid h-24 w-24 place-items-center overflow-hidden border-[1.5px] border-[var(--ink)] bg-[var(--paper-2)] font-display text-[1.6rem] font-extrabold">
              {preview ? (
                // A local blob or an already-optimised Cloudinary URL.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="" className="h-full w-full object-cover" />
              ) : (
                initials(user.name)
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              aria-label="Choose a profile picture"
              className="absolute -bottom-2 -right-2 grid h-9 w-9 place-items-center bg-[var(--spot)] text-white shadow-[var(--shadow-md)] transition-transform hover:scale-110"
            >
              <Camera className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <div className="min-w-0">
            <p className="text-[0.9rem] text-[var(--ink)]">JPG, PNG, WebP or GIF, up to 5 MB.</p>
            <p className="mt-1 text-[0.82rem] text-[var(--ink-soft)]">
              Uploads are stored on Cloudinary and resized automatically.
            </p>
            {state?.errors?.avatar && (
              <p role="alert" className="mt-2 text-[0.82rem] font-medium text-[var(--spot)]">
                {state.errors.avatar}
              </p>
            )}
          </div>

          <input
            ref={fileInput}
            type="file"
            name="avatar"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleAvatarChange}
            className="sr-only"
          />
        </div>
      </section>

      {/* Identity */}
      <section className="flex flex-col gap-5">
        <h2 className="font-display text-[1.3rem]">About you</h2>
        <Input
          label="Display name"
          name="name"
          defaultValue={user.name}
          required
          error={state?.errors?.name}
        />
        <Textarea
          label="Bio"
          name="bio"
          defaultValue={user.bio}
          maxLength={280}
          placeholder="Which fandoms claimed you first?"
          error={state?.errors?.bio}
          hint="Up to 280 characters."
        />
      </section>

      {/* Favourite fandoms */}
      <section>
        <h2 className="font-display text-[1.3rem]">Favourite fandoms</h2>
        <p className="mt-2 text-[0.88rem] text-[var(--ink-soft)]">
          Your dashboard leads with these. Change them whenever your taste does.
        </p>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => {
            const isSelected = selected.includes(category.slug);
            return (
              <button
                key={category.slug}
                type="button"
                onClick={() => toggleCategory(category.slug)}
                aria-pressed={isSelected}
                className={cn(
                  "group relative flex items-center gap-3 overflow-hidden border p-3.5 text-left transition-all duration-200",
                  isSelected
                    ? "border-[var(--spot)] bg-[var(--spot-wash)]"
                    : "border-[var(--rule)] hover:border-[var(--rule-strong)]",
                )}
              >
                <span
                  aria-hidden
                  className="h-8 w-1 shrink-0 transition-all duration-300 group-hover:h-9"
                  style={{ background: `var(--ch-${category.token})` }}
                />
                <span className="min-w-0 flex-1 text-[0.9rem] font-semibold">{category.name}</span>
                <span
                  className={cn(
                    "grid h-5 w-5 shrink-0 place-items-center border transition-colors",
                    isSelected
                      ? "border-[var(--spot)] bg-[var(--spot)] text-white"
                      : "border-[var(--rule-strong)]",
                  )}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" aria-hidden />}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selections travel as repeated fields the server action reads with getAll. */}
        {selected.map((slug) => (
          <input key={slug} type="hidden" name="favoriteCategories" value={slug} />
        ))}
      </section>

      {/* Display preferences */}
      <section>
        <h2 className="font-display text-[1.3rem]">Display preferences</h2>
        <p className="mt-2 text-[0.88rem] text-[var(--ink-soft)]">
          Saved to your account, so they follow you to any device.
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="Theme">
            <div className="grid grid-cols-3 gap-1.5">
              {(["light", "dark", "system"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setLocalTheme(option)}
                  aria-pressed={theme === option}
                  className={cn(
                    "border px-2 py-2.5 text-[0.82rem] capitalize transition-colors",
                    theme === option
                      ? "border-[var(--spot)] bg-[var(--spot-wash)] text-[var(--spot-deep)]"
                      : "border-[var(--rule)] text-[var(--ink-soft)] hover:border-[var(--rule-strong)]",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
            <input type="hidden" name="theme" value={theme} />
          </Field>

          <Field label={`Text size — ${fontScale}%`}>
            <input
              type="range"
              name="fontScale"
              min={90}
              max={130}
              step={5}
              value={fontScale}
              onChange={(event) => setLocalFontScale(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none bg-[var(--paper-2)] accent-[var(--spot)]"
            />
          </Field>
        </div>

        <label className="mt-5 flex cursor-pointer items-center justify-between border-[1.5px] border-[var(--rule-strong)] p-4">
          <span>
            <span className="block text-[0.92rem] font-semibold">Reduce motion</span>
            <span className="block text-[0.82rem] text-[var(--ink-soft)]">
              Turns off the scroll reveals, ticker and hero animation.
            </span>
          </span>
          <input
            type="checkbox"
            name="reducedMotion"
            checked={reducedMotion}
            onChange={(event) => setLocalReducedMotion(event.target.checked)}
            className="h-5 w-5 shrink-0 accent-[var(--spot)]"
          />
        </label>
      </section>

      <div className="flex justify-end border-t border-[var(--rule)] pt-7">
        <Button type="submit" size="lg" loading={pending}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
