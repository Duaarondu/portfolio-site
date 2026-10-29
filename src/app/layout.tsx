/**
 * layout.tsx — the "root layout". Next.js wraps EVERY page in this file,
 * so it's where the <html> and <body> tags, fonts and site-wide
 * metadata (title, description for Google and link previews) live.
 */
import type { Metadata } from "next";

// Self-hosted fonts: installed with npm, bundled with the site,
// so visitors never make a request to Google Fonts.
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aaron Du — AI and software engineering",
  description:
    "Computer Science student at NYIT building LLM agents that check their own work, plus backend and cloud apps on AWS.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased">
      <body>{children}</body>
    </html>
  );
}
