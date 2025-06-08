import { beforeAll, afterAll, afterEach } from "vitest";
import "@testing-library/jest-dom";

// Integration test setup - uses real Supabase instance
// Ensure Supabase is running locally before running integration tests

// Don't mock fetch globally - let auth tests use real Supabase
// Only mock external APIs on a per-test basis

// Mock only console to avoid noise in tests
global.console = {
  ...console,
  // Keep console logs for debugging integration tests
};

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
