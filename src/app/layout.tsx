import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
