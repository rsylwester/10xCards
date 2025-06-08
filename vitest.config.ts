import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "dist/",
        "coverage/",
        "**/*.d.ts",
        "**/*.config.*",
        "src/test/",
        "scripts/",
        "supabase/",
        ".github/",
        "electrical-ephemera/",
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    exclude: ["node_modules/", "dist/", "electrical-ephemera/", "src/**/*.integration.{test,spec}.{js,ts,jsx,tsx}"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@/components": resolve(__dirname, "./src/components"),
      "@/lib": resolve(__dirname, "./src/lib"),
    },
  },
  define: {
    "import.meta.env.PUBLIC_SUPABASE_URL": JSON.stringify("http://127.0.0.1:54321"),
    "import.meta.env.PUBLIC_SUPABASE_ANON_KEY": JSON.stringify("test-anon-key"),
    "import.meta.env.OPENROUTER_API_KEY": JSON.stringify("test-api-key"),
  },
});
