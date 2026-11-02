/**
 * layout.tsx — the "root layout". Next.js wraps EVERY page in this file,
 * so it's where the <html> and <body> tags, fonts and site-wide
 * metadata (title, description for Google and link previews) live.
 */
import type { Metadata } from "next";
import { MotionProvider } from "@/components/MotionProvider";

// Self-hosted fonts: installed with npm, bundled with the site,
// so visitors never make a request to Google Fonts.
import "@fontsource/cinzel-decorative/400.css";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aaron Du — AI and software engineering",
  description:
    "Computer Science student at NYIT building LLM agents that show their work, plus backend and cloud apps on AWS.",
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
