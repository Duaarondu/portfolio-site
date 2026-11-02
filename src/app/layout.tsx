/**
 * layout.tsx — the "root layout". Next.js wraps EVERY page in this file,
 * so it's where the <html> and <body> tags, fonts and site-wide
 * metadata (title, description for Google and link previews) live.
 */
import type { Metadata } from "next";
import { MotionProvider } from "@/components/MotionProvider";
import { profile } from "@/data/profile";

// Self-hosted fonts: installed with npm, bundled with the site,
// so visitors never make a request to Google Fonts.
import "@fontsource/cinzel-decorative/400.css";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

const description =
  "Computer Science student at NYIT building LLM agents that show their work, plus backend and cloud apps on AWS.";

export const metadata: Metadata = {
  // The real domain. Link previews and Google need full URLs; with this
  // set, Next.js turns paths like /opengraph-image into
  // https://duaarondu.com/opengraph-image for you.
  metadataBase: new URL(profile.siteUrl),
  title: "Aaron Du — AI and software engineering",
  description,
  alternates: { canonical: "/" }, // tells Google this is the main address
  // What shows when the link is shared on LinkedIn, iMessage, Slack, Discord...
  // The picture itself comes from src/app/opengraph-image.tsx automatically.
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Aaron Du",
    title: "Aaron Du — AI and software engineering",
    description,
  },
  // X (Twitter) uses the same picture, shown large
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased">
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
