/**
 * robots.ts — becomes /robots.txt, which tells search engines (and AI
 * crawlers) they're welcome to read the site, and where the sitemap is.
 */
import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${profile.siteUrl}/sitemap.xml`,
  };
}
