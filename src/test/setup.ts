import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock environment variables
Object.defineProperty(window, "location", {
  value: {
    href: "http://localhost:4321",
    origin: "http://localhost:4321",
    protocol: "http:",
    host: "localhost:4321",
    hostname: "localhost",
    port: "4321",
    pathname: "/",
    search: "",
    hash: "",
  },
  writable: true,
});

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  // Uncomment below to suppress console logs during tests
  // log: vi.fn(),
  // error: vi.fn(),
  // warn: vi.fn(),
  // info: vi.fn(),
};

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
