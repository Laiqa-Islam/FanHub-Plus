import type { Metadata } from "next";
import { Big_Shoulders, Newsreader, JetBrains_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import { ThemeProvider, themeScript } from "@/components/providers/theme-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AssistantWidget } from "@/components/chat/assistant-widget";
import { getCurrentUser } from "@/lib/dal";
import { isAssistantEnabled } from "@/lib/gemini";

// Condensed, heavy, shouty — the voice of a printed poster or a zine cover.
const shoulders = Big_Shoulders({
  variable: "--font-shoulders",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

// An editorial serif for body copy. A zine is something you read, and a
// serif does the long-form work a UI sans never quite manages.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fan Hub Plus — Fandom in print",
    template: "%s · Fan Hub Plus",
  },
  description:
    "Anime, gaming, film, television, K-Pop, comics, manga and cosplay — written up properly and printed in eight inks. Search, filter, watch, listen and clip.",
  keywords: ["fandom", "anime", "gaming", "K-Pop", "comics", "manga", "cosplay"],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();
  const assistantEnabled = isAssistantEnabled();

  return (
    <html
      lang="en"
      // `no-js` is removed by the theme script; it keeps reveal animations
      // from hiding content when JavaScript is unavailable.
      className={`no-js ${shoulders.variable} ${newsreader.variable} ${jetbrains.variable}`}
      // We set `scroll-behavior: smooth` globally for in-page anchors. Next 16
      // no longer overrides it during route transitions unless this attribute
      // is present, which would otherwise make navigation scroll slowly.
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Runs before paint so the correct theme is on screen immediately. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* Extensions (password managers, colour pickers) commonly inject
          attributes onto <body> before React hydrates, which otherwise
          reports as a hydration mismatch the app cannot fix. */}
      <body className="flex min-h-dvh flex-col" suppressHydrationWarning>
        <ThemeProvider
          initialTheme={(user?.preferences.theme as "light" | "dark" | "system") ?? "system"}
          initialFontScale={user?.preferences.fontScale ?? 100}
          initialReducedMotion={user?.preferences.reducedMotion ?? false}
        >
          <div className="grain" aria-hidden />

          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:border-2 focus:border-[var(--ink)] focus:bg-[var(--spot)] focus:px-5 focus:py-2.5 focus:font-mono focus:text-sm focus:font-semibold focus:uppercase focus:text-white"
          >
            Skip to content
          </a>

          <SiteHeader user={user} />

          <main id="main" className="flex-1">
            {children}
          </main>

          <SiteFooter />

          {/* The assistant is optional (SRS FR-4): with no API key configured
              the widget simply isn't rendered, rather than offering a control
              that cannot work. */}
          {assistantEnabled && <AssistantWidget />}

          <ToastContainer
            position="bottom-right"
            autoClose={4000}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="colored"
            toastClassName="!bg-[var(--paper)] !text-[var(--ink)]"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
