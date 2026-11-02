/**
 * Content checks for src/data/profile.ts. These catch the mistakes that
 * are easy to make when editing by hand: a photo path with a typo, a
 * broken link, or personal info that shouldn't be public.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";

const publicDir = join(__dirname, "..", "public");
const fileExists = (src: string) => existsSync(join(publicDir, src));

describe("profile photos", () => {
  it("every photo in the strip exists in /public", () => {
    for (const photo of profile.about.photos) {
      if (photo.src) expect(fileExists(photo.src), photo.src).toBe(true);
    }
  });

  it("every photo has alt text (for screen readers)", () => {
    for (const photo of profile.about.photos) {
      if (photo.src) expect(photo.alt.trim().length, photo.src).toBeGreaterThan(0);
    }
  });

  it("the banner and end photos exist", () => {
    if (profile.banner.src) expect(fileExists(profile.banner.src)).toBe(true);
    expect(fileExists(profile.endPhoto.src)).toBe(true);
  });
});

describe("profile links", () => {
  it("the resume PDF exists", () => {
    if (profile.links.resume) expect(fileExists(profile.links.resume)).toBe(true);
  });

  it("outside links use https", () => {
    for (const url of [profile.links.github, profile.links.linkedin, profile.links.x, profile.links.discord]) {
      if (url) expect(url.startsWith("https://"), url).toBe(true);
    }
  });

  it("the email looks like an email", () => {
    expect(profile.links.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  });
});

describe("privacy", () => {
  it("no phone number anywhere in the site content", () => {
    const text = JSON.stringify(profile);
    expect(text).not.toMatch(/\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/);
  });
});
