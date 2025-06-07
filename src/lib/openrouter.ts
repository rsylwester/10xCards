interface FlashcardCandidate {
  front: string;
  back: string;
}

export async function generateFlashcards(text: string): Promise<FlashcardCandidate[]> {
  try {
    const response = await fetch("/api/generate-flashcards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate flashcards");
    }

    const data = await response.json();
    return data.flashcards || [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error generating flashcards:", error);
    throw error;
  }
}

export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}
