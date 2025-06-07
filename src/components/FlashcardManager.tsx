import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Flashcard } from "../lib/supabase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Pencil, Trash2, Check, X, Bot, User, Star } from "lucide-react";

export function FlashcardManager() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFront, setEditFront] = useState("");
  const [editBack, setEditBack] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("flashcards")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setFlashcards(data || []);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error fetching flashcards:", err);
      setError(err instanceof Error ? err.message : "Failed to load flashcards");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (flashcard: Flashcard) => {
    setEditingId(flashcard.id);
    setEditFront(flashcard.front);
    setEditBack(flashcard.back);
  };

  const handleSaveEdit = async () => {
    if (!editFront.trim() || !editBack.trim() || !editingId) {
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from("flashcards")
        .update({
          front: editFront.trim(),
          back: editBack.trim(),
        })
        .eq("id", editingId);

      if (error) {
        throw error;
      }

      setFlashcards((prev) =>
        prev.map((card) => (card.id === editingId ? { ...card, front: editFront.trim(), back: editBack.trim() } : card))
      );

      setEditingId(null);
      setEditFront("");
      setEditBack("");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error updating flashcard:", err);
      setError(err instanceof Error ? err.message : "Failed to update flashcard");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFront("");
    setEditBack("");
  };

  const handleDelete = async (flashcardId: string) => {
    if (!confirm("Are you sure you want to delete this flashcard?")) {
      return;
    }

    try {
      const { error } = await supabase.from("flashcards").delete().eq("id", flashcardId);

      if (error) {
        throw error;
      }

      setFlashcards((prev) => prev.filter((card) => card.id !== flashcardId));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error deleting flashcard:", err);
      setError(err instanceof Error ? err.message : "Failed to delete flashcard");
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "ai":
        return <Bot className="w-4 h-4 text-blue-400" />;
      case "manual":
        return <User className="w-4 h-4 text-green-400" />;
      case "default":
        return <Star className="w-4 h-4 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case "ai":
        return "AI Generated";
      case "manual":
        return "Manual";
      case "default":
        return "Default";
      default:
        return source;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="p-6 bg-gray-800 border-gray-700">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Your Flashcards</h2>
          <p className="text-gray-400">
            Manage your flashcard collection. You have {flashcards.length} flashcard{flashcards.length !== 1 ? "s" : ""}
            .
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm">{error}</div>
        )}

        {flashcards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Bot className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No flashcards yet</p>
              <p className="text-sm">Start by generating flashcards with AI or creating your own.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {flashcards.map((flashcard) => (
              <Card key={flashcard.id} className="p-4 bg-gray-700 border-gray-600">
                {editingId === flashcard.id ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`edit-front-${flashcard.id}`} className="text-white text-sm">
                        English (Front)
                      </Label>
                      <Input
                        id={`edit-front-${flashcard.id}`}
                        value={editFront}
                        onChange={(e) => setEditFront(e.target.value)}
                        className="bg-gray-600 border-gray-500 text-white"
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edit-back-${flashcard.id}`} className="text-white text-sm">
                        Polish (Back)
                      </Label>
                      <Input
                        id={`edit-back-${flashcard.id}`}
                        value={editBack}
                        onChange={(e) => setEditBack(e.target.value)}
                        className="bg-gray-600 border-gray-500 text-white"
                        disabled={saving}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSaveEdit}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={saving || !editFront.trim() || !editBack.trim()}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        {saving ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        size="sm"
                        variant="outline"
                        className="border-gray-500 text-gray-300"
                        disabled={saving}
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
                        <span className="text-blue-400 font-medium">{flashcard.front}</span>
                      </div>
                      <div className="text-gray-300 mb-2">{flashcard.back}</div>
                      <div className="flex items-center space-x-2">
                        {getSourceIcon(flashcard.source)}
                        <span className="text-xs text-gray-500">{getSourceLabel(flashcard.source)}</span>
                        <span className="text-xs text-gray-500">
                          • Added {new Date(flashcard.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <Button
                        onClick={() => handleEdit(flashcard)}
                        size="sm"
                        variant="outline"
                        className="border-gray-500 text-gray-300 hover:bg-gray-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(flashcard.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
