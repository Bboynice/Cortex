import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/src/components/providers/ThemeProvider";
import { QueryProvider } from "@/src/components/providers/QueryProvider";

// Self-hosted via `next/font/local`: Next inlines preloads, strips unused
// glyphs at build time, and avoids any FOIT/FOUT. The font files live under
// `src/assets/fonts/`. Exposing it as `--font-sans` lets Tailwind's
// `font-sans` utility resolve to Satoshi site-wide.
// Two variable-axis files cover weights 300–900 (Light → Black) for both
// upright and italic styles. WOFF2 keeps the bundle ~30% smaller than TTF.
const satoshi = localFont({
  src: [
    {
      path: "../assets/fonts/Satoshi-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
    {
      path: "../assets/fonts/Satoshi-VariableItalic.woff2",
      weight: "300 900",
      style: "italic",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

// Clash Display: same studio (ITF) as Satoshi, designed to pair with it.
// Reserved for hero / display-sized headings only — never body text. Variable
// axis covers weights 200–700 in a single ~120 KB file.
const clashDisplay = localFont({
  src: [
    {
      path: "../assets/fonts/ClashDisplay-Variable.woff2",
      weight: "200 700",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  // The `darkreader-lock` meta tells the Dark Reader browser extension to
  // leave the page alone. Without it, the extension rewrites SVG fill/stroke
  // attributes and inline styles on the client, causing React hydration
  // mismatches on every page that renders icons or Framer Motion SVGs.
  other: {
    "darkreader-lock": "true",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${satoshi.variable} ${clashDisplay.variable}`}
    >
      <head>
        {/* This blocking inline script evaluates instantly before the browser 
          paints the layout elements, pulling dark/light states from localStorage 
          or native system settings to prevent white screen flashbangs.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('cortex-theme') === 'dark' || (!('cortex-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="font-sans">
        <QueryProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}