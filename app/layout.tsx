import type { Metadata } from "next";
import { Unbounded, Inter, JetBrains_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

import { ThemeProvider, themeScript } from "@/components/providers/theme-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AssistantWidget } from "@/components/chat/assistant-widget";
import { getCurrentUser } from "@/lib/dal";
import { isAssistantEnabled } from "@/lib/gemini";

// Wide, geometric and heavy — the voice of a neon sign, and the display
// face the Neon Oni mockup is built on.
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  display: "swap",
});

// Inter carries the body copy, per the Nocturne system this theme extends.
// A UI sans is the right register here: the page is a screen, not a page.
const inter = Inter({
  variable: "--font-inter",
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
    default: "Fan Hub Plus — The city glows louder after dark",
    template: "%s · Fan Hub Plus",
  },
  description:
    "Anime, gaming, film, television, K-Pop, comics, manga and cosplay — eight channels lit in neon. Stream the drops, open the character files, and save what you love.",
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
      className={`no-js ${unbounded.variable} ${inter.variable} ${jetbrains.variable}`}
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
          initialFontScale={user?.preferences.fontScale ?? 100}
          initialReducedMotion={user?.preferences.reducedMotion ?? false}
        >
          <CartProvider>
            <div className="scan" aria-hidden />

            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-[var(--n1)] focus:px-5 focus:py-2.5 focus:font-mono focus:text-sm focus:font-semibold focus:uppercase focus:tracking-[0.12em] focus:text-[var(--void)]"
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
              theme="dark"
              toastClassName="!bg-[var(--paper-3)] !text-[var(--ink)]"
            />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
