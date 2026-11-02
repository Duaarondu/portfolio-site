import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    // Allow YouTube's thumbnail images for the click-to-play demo video
    remotePatterns: [new URL("https://i.ytimg.com/vi/**")],
    // Image qualities the site may request (75 is the default; 90 for photos)
    qualities: [75, 90],
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
