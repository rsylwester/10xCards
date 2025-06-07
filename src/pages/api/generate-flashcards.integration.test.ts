import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Astro environment for testing
const mockEnv = {
  OPENROUTER_API_KEY: "test-api-key",
};

// Type for mock request
interface MockRequest {
  json: () => Promise<Record<string, unknown>>;
}

interface MockContext {
  request: MockRequest;
}

// Import the POST handler after setting up mocks
vi.mock("astro:env", () => ({
  getSecret: (key: string) => mockEnv[key as keyof typeof mockEnv],
}));

describe("generate-flashcards API", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock fetch for OpenRouter API
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("openrouter.ai")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [
                {
                  message: {
                    content: JSON.stringify([
                      { front: "Sophisticated", back: "Wyrafinowany" },
                      { front: "Comprehensive", back: "Kompleksowy" },
                    ]),
                  },
                },
              ],
            }),
        });
      }
      return Promise.reject(new Error("Unexpected URL"));
    });
  });

  it("should generate flashcards from text", async () => {
    // Create a mock request
    const mockRequest = {
      json: () =>
        Promise.resolve({
          text: "This is a sophisticated and comprehensive analysis of the subject matter.",
        }),
    };

    // We'll need to import the handler dynamically since it uses import.meta.env
    const { POST } = await import("./generate-flashcards");

    const response = await POST({ request: mockRequest } as MockContext);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.flashcards).toHaveLength(2);
    expect(result.flashcards[0]).toEqual({
      front: "Sophisticated",
      back: "Wyrafinowany",
    });
  });

  it("should handle missing text", async () => {
    const mockRequest = {
      json: () => Promise.resolve({}),
    };

    const { POST } = await import("./generate-flashcards");
    const response = await POST({ request: mockRequest } as MockContext);
    const result = await response.json();

    expect(response.status).toBe(400);
    expect(result.error).toBe("Text is required");
  });

  it("should handle missing API key", async () => {
    // Temporarily remove API key
    const originalKey = mockEnv.OPENROUTER_API_KEY;
    mockEnv.OPENROUTER_API_KEY = "";

    const mockRequest = {
      json: () =>
        Promise.resolve({
          text: "Test text",
        }),
    };

    const { POST } = await import("./generate-flashcards");
    const response = await POST({ request: mockRequest } as MockContext);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result.error).toContain("OpenRouter API key not configured");

    // Restore API key
    mockEnv.OPENROUTER_API_KEY = originalKey;
  });

  it("should handle OpenRouter API errors", async () => {
    // Mock API error
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 429,
    });

    const mockRequest = {
      json: () =>
        Promise.resolve({
          text: "Test text",
        }),
    };

    const { POST } = await import("./generate-flashcards");
    const response = await POST({ request: mockRequest } as MockContext);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result.error).toContain("OpenRouter API error");
  });

  it("should handle malformed JSON response", async () => {
    // Mock malformed response
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          choices: [
            {
              message: {
                content: "invalid json",
              },
            },
          ],
        }),
    });

    const mockRequest = {
      json: () =>
        Promise.resolve({
          text: "Test text",
        }),
    };

    const { POST } = await import("./generate-flashcards");
    const response = await POST({ request: mockRequest } as MockContext);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result.error).toBe("Failed to parse AI response as JSON");
  });

  it("should limit text to 1500 words", async () => {
    const longText = Array(2000).fill("word").join(" ");

    const mockRequest = {
      json: () =>
        Promise.resolve({
          text: longText,
        }),
    };

    const { POST } = await import("./generate-flashcards");
    await POST({ request: mockRequest } as MockContext);

    // Verify that the API was called with limited text
    expect(global.fetch).toHaveBeenCalledWith(
      "https://openrouter.ai/api/v1/chat/completions",
      expect.objectContaining({
        body: expect.stringContaining(Array(1500).fill("word").join(" ")),
      })
    );
  });
});
