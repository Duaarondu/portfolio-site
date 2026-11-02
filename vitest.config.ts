/**
 * vitest.config.ts — settings for the test runner (Vitest).
 * Tests live in /tests and end in .test.ts. Run them with `npm test`.
 */
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Same "@/..." shortcut as tsconfig.json, so tests can import site code
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
