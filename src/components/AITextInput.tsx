import { useState } from "react";
import { generateFlashcards, countWords } from "../lib/openrouter";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Card } from "./ui/card";

interface FlashcardCandidate {
  front: string;
  back: string;
  id: string;
  edited: boolean;
  rejected: boolean;
}

interface AITextInputProps {
  onFlashcardsGenerated: (candidates: FlashcardCandidate[]) => void;
}

export function AITextInput({ onFlashcardsGenerated }: AITextInputProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const wordCount = countWords(text);
  const isOverLimit = wordCount > 1500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Please enter some text");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const flashcards = await generateFlashcards(text);

      if (flashcards.length === 0) {
        setError(
          "No suitable flashcards could be generated from this text. Try using text with more advanced vocabulary."
        );
        return;
      }

      const candidates = flashcards.map((card, index) => ({
        ...card,
        id: `candidate-${index}`,
        edited: false,
        rejected: false,
      }));

      onFlashcardsGenerated(candidates);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error generating flashcards:", err);
      setError(err instanceof Error ? err.message : "Failed to generate flashcards. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-6 bg-gray-800 border-gray-700">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Generate Flashcards with AI</h2>
          <p className="text-gray-400">
            Paste English text below and AI will extract useful vocabulary for B2/C1 level learners.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="text-input" className="text-white mb-2 block">
              English Text
            </Label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-64 p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
              placeholder="Paste your English text here..."
              disabled={loading}
            />

            <div className="flex justify-between items-center mt-2">
              <span className={`text-sm ${isOverLimit ? "text-red-400" : "text-gray-400"}`}>
                {wordCount} / 1500 words
              </span>
              {isOverLimit && <span className="text-sm text-orange-400">Only first 1500 words will be processed</span>}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !text.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating Flashcards...</span>
              </div>
            ) : (
              "Generate Flashcards"
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-gray-900/50 rounded border border-gray-700">
          <h3 className="text-white font-medium mb-2">Tips for better results:</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Use academic or professional texts</li>
            <li>• Include context around advanced vocabulary</li>
            <li>• Avoid very basic or technical jargon</li>
            <li>• Articles, essays, and reports work best</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
