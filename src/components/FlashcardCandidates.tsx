import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Pencil, Trash2, Check, X } from "lucide-react";

interface FlashcardCandidate {
  front: string;
  back: string;
  id: string;
  edited: boolean;
  rejected: boolean;
}

interface FlashcardCandidatesProps {
  candidates: FlashcardCandidate[];
  onCandidatesUpdate: (candidates: FlashcardCandidate[]) => void;
  onComplete: () => void;
}

export function FlashcardCandidates({ candidates, onCandidatesUpdate, onComplete }: FlashcardCandidatesProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFront, setEditFront] = useState("");
  const [editBack, setEditBack] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const activeCandidates = candidates.filter((c) => !c.rejected);

  const handleEdit = (candidate: FlashcardCandidate) => {
    setEditingId(candidate.id);
    setEditFront(candidate.front);
    setEditBack(candidate.back);
  };

  const handleSaveEdit = () => {
    if (!editFront.trim() || !editBack.trim()) {
      return;
    }

    const updatedCandidates = candidates.map((candidate) =>
      candidate.id === editingId ? { ...candidate, front: editFront, back: editBack, edited: true } : candidate
    );

    onCandidatesUpdate(updatedCandidates);
    setEditingId(null);
    setEditFront("");
    setEditBack("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFront("");
    setEditBack("");
  };

  const handleReject = (candidateId: string) => {
    const updatedCandidates = candidates.map((candidate) =>
      candidate.id === candidateId ? { ...candidate, rejected: true } : candidate
    );

    onCandidatesUpdate(updatedCandidates);
  };

  const handleUnreject = (candidateId: string) => {
    const updatedCandidates = candidates.map((candidate) =>
      candidate.id === candidateId ? { ...candidate, rejected: false } : candidate
    );

    onCandidatesUpdate(updatedCandidates);
  };

  const handleAddFlashcards = async () => {
    if (activeCandidates.length === 0) {
      setError("No flashcards to add. Please keep at least one candidate.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const flashcardsToInsert = activeCandidates.map((candidate) => ({
        user_id: user.id,
        front: candidate.front,
        back: candidate.back,
        source: "ai" as const,
      }));

      const { error: insertError } = await supabase.from("flashcards").insert(flashcardsToInsert);

      if (insertError) {
        throw insertError;
      }

      onComplete();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error saving flashcards:", err);
      setError(err instanceof Error ? err.message : "Failed to save flashcards");
    } finally {
      setSaving(false);
    }
  };

  if (candidates.length === 0) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-6 bg-gray-800 border-gray-700">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Review Generated Flashcards</h2>
          <p className="text-gray-400">
            Review, edit, or reject the flashcards below. Only accepted flashcards will be added to your collection.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm">{error}</div>
        )}

        <div className="space-y-4 mb-6">
          {candidates.map((candidate) => (
            <Card
              key={candidate.id}
              className={`p-4 ${
                candidate.rejected ? "bg-gray-900/50 border-gray-600 opacity-50" : "bg-gray-700 border-gray-600"
              }`}
            >
              {editingId === candidate.id ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`edit-front-${candidate.id}`} className="text-white text-sm">
                      English (Front)
                    </Label>
                    <Input
                      id={`edit-front-${candidate.id}`}
                      value={editFront}
                      onChange={(e) => setEditFront(e.target.value)}
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`edit-back-${candidate.id}`} className="text-white text-sm">
                      Polish (Back)
                    </Label>
                    <Input
                      id={`edit-back-${candidate.id}`}
                      value={editBack}
                      onChange={(e) => setEditBack(e.target.value)}
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSaveEdit} size="sm" className="bg-green-600 hover:bg-green-700">
                      <Check className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      size="sm"
                      variant="outline"
                      className="border-gray-500 text-gray-300"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2">
                      <span className="text-blue-400 font-medium">{candidate.front}</span>
                      {candidate.edited && <span className="ml-2 text-xs text-yellow-400">(edited)</span>}
                    </div>
                    <div className="text-gray-300">{candidate.back}</div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    {!candidate.rejected ? (
                      <>
                        <Button
                          onClick={() => handleEdit(candidate)}
                          size="sm"
                          variant="outline"
                          className="border-gray-500 text-gray-300 hover:bg-gray-600"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleReject(candidate.id)}
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => handleUnreject(candidate.id)}
                        size="sm"
                        variant="outline"
                        className="border-green-500 text-green-400 hover:bg-green-900/20"
                      >
                        Restore
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            {activeCandidates.length} of {candidates.length} flashcards will be added
          </div>

          <Button
            onClick={handleAddFlashcards}
            disabled={saving || activeCandidates.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {saving ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </div>
            ) : (
              `Add ${activeCandidates.length} Flashcard${activeCandidates.length !== 1 ? "s" : ""}`
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
