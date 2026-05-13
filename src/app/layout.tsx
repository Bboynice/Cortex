import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted via `next/font/local`: Next inlines preloads, strips unused
// glyphs at build time, and avoids any FOIT/FOUT. The font file lives under
// `src/assets/fonts/`. Exposing it as `--font-sans` lets Tailwind's
// `font-sans` utility resolve to Space Grotesk site-wide.
// Single variable-axis file covers weights 300–700 (no italics in Space Grotesk).
const spaceGrotesk = localFont({
  src: [
    {
      path: "../assets/fonts/SpaceGrotesk-VariableFont_wght.ttf",
      weight: "300 700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
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
    <html lang="en" className={`dark ${spaceGrotesk.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
