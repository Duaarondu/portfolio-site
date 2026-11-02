/**
 * sitemap.ts — becomes /sitemap.xml, a list of the site's pages for
 * Google. One page for now; add more here if you make project pages.
 */
import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: profile.siteUrl, changeFrequency: "monthly", priority: 1 }];
}
