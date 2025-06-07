import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateQuizQuestion, getRandomFlashcard } from "./quiz";
import type { Flashcard } from "./supabase";

// Mock Supabase
vi.mock("./supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [],
          error: null,
        })),
      })),
    })),
  },
}));

describe("quiz", () => {
  const mockFlashcards: Flashcard[] = [
    {
      id: "1",
      user_id: "user1",
      front: "Hello",
      back: "Cześć",
      source: "manual",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    },
    {
      id: "2",
      user_id: "user1",
      front: "World",
      back: "Świat",
      source: "manual",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    },
    {
      id: "3",
      user_id: "user1",
      front: "Cat",
      back: "Kot",
      source: "manual",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    },
    {
      id: "4",
      user_id: "user1",
      front: "Dog",
      back: "Pies",
      source: "manual",
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset Math.random to be deterministic for testing
    vi.spyOn(Math, "random").mockReturnValue(0.5);
  });

  describe("getRandomFlashcard", () => {
    it("should return a random flashcard from the array", () => {
      const result = getRandomFlashcard(mockFlashcards);
      expect(mockFlashcards).toContain(result);
    });

    it("should throw error for empty array", () => {
      expect(() => getRandomFlashcard([])).toThrow("No flashcards available");
    });

    it("should return the only flashcard if array has one item", () => {
      const singleCard = [mockFlashcards[0]];
      const result = getRandomFlashcard(singleCard);
      expect(result).toBe(mockFlashcards[0]);
    });
  });

  describe("generateQuizQuestion", () => {
    it("should generate a quiz question with 4 options", () => {
      const targetCard = mockFlashcards[0];
      const result = generateQuizQuestion(targetCard, mockFlashcards);

      expect(result.flashcard).toBe(targetCard);
      expect(result.options).toHaveLength(4);
      expect(result.options).toContain(targetCard.back);
      expect(result.correctAnswer).toBe(targetCard.back);
    });

    it("should include the correct answer in options", () => {
      const targetCard = mockFlashcards[0];
      const result = generateQuizQuestion(targetCard, mockFlashcards);

      expect(result.options).toContain(result.correctAnswer);
    });

    it("should generate unique options", () => {
      const targetCard = mockFlashcards[0];
      const result = generateQuizQuestion(targetCard, mockFlashcards);

      const uniqueOptions = new Set(result.options);
      expect(uniqueOptions.size).toBe(result.options.length);
    });

    it("should handle case with fewer than 4 cards", () => {
      const limitedCards = mockFlashcards.slice(0, 2);
      const targetCard = limitedCards[0];
      const result = generateQuizQuestion(targetCard, limitedCards);

      // Should still generate 4 options using predefined distractors
      expect(result.options).toHaveLength(4);
      expect(result.options).toContain(targetCard.back);
    });

    it("should shuffle options randomly", () => {
      const targetCard = mockFlashcards[0];

      // Mock Math.random to return different values for shuffling
      const randomValues = [0.1, 0.3, 0.7, 0.9];
      let callCount = 0;
      vi.spyOn(Math, "random").mockImplementation(() => {
        return randomValues[callCount++ % randomValues.length];
      });

      const result = generateQuizQuestion(targetCard, mockFlashcards);

      // The correct answer should be somewhere in the shuffled options
      expect(result.options).toContain(targetCard.back);
      expect(result.options).toHaveLength(4);
    });
  });
});
