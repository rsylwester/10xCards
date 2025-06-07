import { vi } from "vitest";

// Integration test setup - uses real Supabase instance
// Ensure Supabase is running locally before running integration tests

// Mock only external APIs, not Supabase
const originalFetch = global.fetch;

global.fetch = vi.fn().mockImplementation((url: string, ...args) => {
  // Allow Supabase calls to go through
  if (typeof url === "string" && url.includes("localhost:54321")) {
    return originalFetch(url, ...args);
  }

  // Mock OpenRouter API calls
  if (typeof url === "string" && url.includes("openrouter.ai")) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          choices: [
            {
              message: {
                content: JSON.stringify([
                  { front: "Test Word", back: "Testowe Słowo" },
                  { front: "Example", back: "Przykład" },
                ]),
              },
            },
          ],
        }),
    });
  }

  // For all other external calls, use the mock
  return originalFetch(url, ...args);
});

// Setup database cleanup after each test
afterEach(async () => {
  // Clean up test data from database if needed
  // This would require actual database cleanup logic
});

beforeAll(async () => {
  // Ensure test database is in clean state
  // eslint-disable-next-line no-console
  console.log("Setting up integration test database...");
});

afterAll(async () => {
  // Final cleanup
  // eslint-disable-next-line no-console
  console.log("Cleaning up integration test database...");
});
