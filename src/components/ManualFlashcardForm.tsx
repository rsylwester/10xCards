import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";

interface ManualFlashcardFormProps {
  onSuccess?: () => void;
}

export function ManualFlashcardForm({ onSuccess }: ManualFlashcardFormProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!front.trim() || !back.trim()) {
      setError("Both fields are required");
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error: insertError } = await supabase.from("flashcards").insert({
        user_id: user.id,
        front: front.trim(),
        back: back.trim(),
        source: "manual",
      });

      if (insertError) {
        throw insertError;
      }

      setSuccessMessage("Flashcard added successfully!");
      setFront("");
      setBack("");

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error saving flashcard:", err);
      setError(err instanceof Error ? err.message : "Failed to save flashcard");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-6 bg-gray-800 border-gray-700">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Add Your Own Flashcard</h2>
          <p className="text-gray-400">
            Create a custom flashcard with an English word or phrase and its Polish translation.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm">{error}</div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded text-green-300 text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="front" className="text-white mb-2 block">
              English Word/Phrase (Front)
            </Label>
            <Input
              id="front"
              type="text"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
              placeholder="Enter English word or phrase"
              disabled={saving}
              required
            />
          </div>

          <div>
            <Label htmlFor="back" className="text-white mb-2 block">
              Polish Translation (Back)
            </Label>
            <Input
              id="back"
              type="text"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
              placeholder="Enter Polish translation"
              disabled={saving}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={saving || !front.trim() || !back.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {saving ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Adding Flashcard...</span>
              </div>
            ) : (
              "Add Flashcard"
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-gray-900/50 rounded border border-gray-700">
          <h3 className="text-white font-medium mb-2">Tips for creating good flashcards:</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Keep phrases concise and contextual</li>
            <li>• Include the most common meaning</li>
            <li>• Use proper capitalization and spelling</li>
            <li>• Consider adding usage context when helpful</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
