"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

/**
 * Display and accessibility preferences.
 *
 * Neon Oni is a single-ground theme: there is no light mode, because a neon
 * sign only reads against the night. The light/dark control the previous
 * print theme carried is gone with it, and with it goes SRS FR-12's colour
 * scheme clause — a deliberate trade the design brief asked for. The two
 * controls that survive are the ones the theme does not fight: text size and
 * reduced motion.
 *
 * Both are held in localStorage so a visitor's choice survives reloads;
 * signed-in users also have them persisted to their profile.
 */

type ThemeContextValue = {
  fontScale: number;
  setFontScale: (scale: number) => void;
  reducedMotion: boolean;
  setReducedMotion: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const FONT_KEY = "fanhub:font-scale";
export const MOTION_KEY = "fanhub:reduced-motion";

export function ThemeProvider({
  children,
  initialFontScale = 100,
  initialReducedMotion = false,
}: {
  children: React.ReactNode;
  initialFontScale?: number;
  initialReducedMotion?: boolean;
}) {
  const [fontScale, setFontScaleState] = useState(initialFontScale);
  const [reducedMotion, setReducedMotionState] = useState(initialReducedMotion);

  // Hydrate from localStorage, which the blocking script already read.
  useEffect(() => {
    const storedScale = Number(localStorage.getItem(FONT_KEY)) || initialFontScale;
    const storedMotion = localStorage.getItem(MOTION_KEY) === "true" || initialReducedMotion;

    setFontScaleState(storedScale);
    setReducedMotionState(storedMotion);
  }, [initialFontScale, initialReducedMotion]);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-scale", `${fontScale}%`);
  }, [fontScale]);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reducedMotion);
  }, [reducedMotion]);

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
      value={{ fontScale, setFontScale, reducedMotion, setReducedMotion }}
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
 * Runs before first paint to stamp the font scale and motion preference onto
 * <html>. The ground is dark in the stylesheet itself, so there is no colour
 * scheme to resolve here any more — only the two preferences that would
 * otherwise flash at their defaults before React hydrates.
 */
export const themeScript = `
(function(){
  try {
    var d = document.documentElement;
    d.classList.remove('no-js');
    var f = localStorage.getItem('${FONT_KEY}');
    if (f) d.style.setProperty('--font-scale', f + '%');
    d.dataset.reducedMotion = localStorage.getItem('${MOTION_KEY}') === 'true';
  } catch (e) {}
})();
`;
