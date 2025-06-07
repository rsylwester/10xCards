import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateFlashcards, countWords } from "./openrouter";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("openrouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("countWords", () => {
    it("should count words correctly", () => {
      expect(countWords("hello world")).toBe(2);
      expect(countWords("  hello   world  ")).toBe(2);
      expect(countWords("")).toBe(0);
      expect(countWords("   ")).toBe(0);
      expect(countWords("single")).toBe(1);
    });

    it("should handle complex text", () => {
      const text = "This is a test sentence with punctuation! And another one.";
      expect(countWords(text)).toBe(10);
    });

    it("should handle special characters", () => {
      expect(countWords("word1, word2; word3: word4")).toBe(4);
    });
  });

  describe("generateFlashcards", () => {
    it("should generate flashcards from API response", async () => {
      const mockResponse = {
        ok: true,
        json: () =>
          Promise.resolve({
            flashcards: [
              { front: "Hello", back: "Cześć" },
              { front: "World", back: "Świat" },
            ],
          }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await generateFlashcards("Hello world");

      expect(result).toEqual([
        { front: "Hello", back: "Cześć" },
        { front: "World", back: "Świat" },
      ]);

      expect(mockFetch).toHaveBeenCalledWith("/api/generate-flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: "Hello world" }),
      });
    });

    it("should handle API errors", async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({ error: "API Error" }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      await expect(generateFlashcards("test")).rejects.toThrow("API Error");
    });

    it("should handle network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(generateFlashcards("test")).rejects.toThrow("Network error");
    });

    it("should return empty array for malformed response", async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({}),
      };

      mockFetch.mockResolvedValueOnce(mockResponse);

      const result = await generateFlashcards("test");
      expect(result).toEqual([]);
    });
  });
});
