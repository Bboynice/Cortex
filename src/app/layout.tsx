import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
    <html lang="en" className={`dark ${satoshi.variable} ${clashDisplay.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
