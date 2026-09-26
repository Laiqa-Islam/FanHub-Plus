"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

/**
 * Theme + accessibility preferences (SRS FR-12).
 *
 * Held in localStorage so a visitor's choice survives reloads; signed-in users
 * also have this persisted to their profile.
 */

export type ThemeMode = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  fontScale: number;
  setFontScale: (scale: number) => void;
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const THEME_KEY = "fanhub:theme";
export const FONT_KEY = "fanhub:font-scale";
export const MOTION_KEY = "fanhub:reduced-motion";

function systemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(mode: ThemeMode) {
  const isDark = mode === "dark" || (mode === "system" && systemPrefersDark());
  document.documentElement.classList.toggle("dark", isDark);
  return isDark ? "dark" : "light";
}

export function ThemeProvider({
  children,
  initialTheme = "system",
  initialFontScale = 100,
  initialReducedMotion = false,
}: {
  children: React.ReactNode;
  initialTheme?: ThemeMode;
  initialFontScale?: number;
  initialReducedMotion?: boolean;
}) {
  const [theme, setThemeState] = useState<ThemeMode>(initialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");
  const [fontScale, setFontScaleState] = useState(initialFontScale);
  const [reducedMotion, setReducedMotionState] = useState(initialReducedMotion);

  // Hydrate from localStorage, which the blocking script already read.
  useEffect(() => {
    const stored = (localStorage.getItem(THEME_KEY) as ThemeMode | null) ?? initialTheme;
    const storedScale = Number(localStorage.getItem(FONT_KEY)) || initialFontScale;
    const storedMotion = localStorage.getItem(MOTION_KEY) === "true" || initialReducedMotion;

    setThemeState(stored);
    setResolvedTheme(applyTheme(stored));
    setFontScaleState(storedScale);
    setReducedMotionState(storedMotion);
  }, [initialTheme, initialFontScale, initialReducedMotion]);

  // Follow the OS while the user is on "system".
  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolvedTheme(applyTheme("system"));
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-scale", `${fontScale}%`);
  }, [fontScale]);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reducedMotion);
  }, [reducedMotion]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    setResolvedTheme(applyTheme(mode));
    localStorage.setItem(THEME_KEY, mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const isDark =
        current === "dark" || (current === "system" && systemPrefersDark());
      const next: ThemeMode = isDark ? "light" : "dark";
      setResolvedTheme(applyTheme(next));
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  }, []);

  const setFontScale = useCallback((scale: number) => {
    const clamped = Math.min(130, Math.max(90, scale));
    setFontScaleState(clamped);
    localStorage.setItem(FONT_KEY, String(clamped));
  }, []);

  const setReducedMotion = useCallback((value: boolean) => {
    setReducedMotionState(value);
    localStorage.setItem(MOTION_KEY, String(value));
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        fontScale,
        setFontScale,
        reducedMotion,
        setReducedMotion,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside <ThemeProvider>.");
  return context;
}

/**
 * Runs before first paint to stamp the theme class, font scale and motion
 * preference onto <html>, preventing a light-mode flash on a dark-mode load.
 */
export const themeScript = `
(function(){
  try {
    var d = document.documentElement;
    d.classList.remove('no-js');
    var t = localStorage.getItem('${THEME_KEY}') || 'system';
    var dark = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    d.classList.toggle('dark', dark);
    var f = localStorage.getItem('${FONT_KEY}');
    if (f) d.style.setProperty('--font-scale', f + '%');
    d.dataset.reducedMotion = localStorage.getItem('${MOTION_KEY}') === 'true';
  } catch (e) {}
})();
`;
