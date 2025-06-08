import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/integration-setup.ts"],
    testTimeout: 30000,
    include: ["src/**/*.integration.{test,spec}.{js,ts,jsx,tsx}"],
    exclude: ["node_modules/", "dist/", "electrical-ephemera/"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@/components": resolve(__dirname, "./src/components"),
      "@/lib": resolve(__dirname, "./src/lib"),
    },
  },
  define: {
    "import.meta.env.PUBLIC_SUPABASE_URL": JSON.stringify(process.env.PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321"),
    "import.meta.env.PUBLIC_SUPABASE_ANON_KEY": JSON.stringify(
      process.env.PUBLIC_SUPABASE_ANON_KEY ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
    ),
    "import.meta.env.OPENROUTER_API_KEY": JSON.stringify(process.env.OPENROUTER_API_KEY || "test-api-key"),
  },
});
