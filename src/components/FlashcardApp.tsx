import { useState, useEffect } from "react";
import { getCurrentUser, onAuthStateChange } from "../lib/auth";
import type { User } from "@supabase/supabase-js";

import { AuthForm } from "./AuthForm";
import { AppNavigation } from "./AppNavigation";
import { Quiz } from "./Quiz";
import { AITextInput } from "./AITextInput";
import { FlashcardCandidates } from "./FlashcardCandidates";
import { ManualFlashcardForm } from "./ManualFlashcardForm";
import { FlashcardManager } from "./FlashcardManager";

interface FlashcardCandidate {
  front: string;
  back: string;
  id: string;
  edited: boolean;
  rejected: boolean;
}

export function FlashcardApp() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("quiz");
  const [flashcardCandidates, setFlashcardCandidates] = useState<FlashcardCandidate[]>([]);

  useEffect(() => {
    // Check initial auth state
    getCurrentUser().then((user) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = onAuthStateChange((user) => {
      setUser(user);
      if (user) {
        setCurrentView("quiz"); // Reset to quiz when user logs in
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSuccess = () => {
    // Auth state will be updated by the listener
    setCurrentView("quiz");
  };

  const handleSignOut = () => {
    setUser(null);
    setCurrentView("quiz");
    setFlashcardCandidates([]);
  };

  const handleFlashcardsGenerated = (candidates: FlashcardCandidate[]) => {
    setFlashcardCandidates(candidates);
    setCurrentView("review-candidates");
  };

  const handleCandidatesComplete = () => {
    setFlashcardCandidates([]);
    setCurrentView("manage");
  };

  const handleManualFlashcardSuccess = () => {
    setCurrentView("manage");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onSuccess={handleAuthSuccess} />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "quiz":
        return <Quiz />;

      case "ai-add":
        return <AITextInput onFlashcardsGenerated={handleFlashcardsGenerated} />;

      case "review-candidates":
        return (
          <FlashcardCandidates
            candidates={flashcardCandidates}
            onCandidatesUpdate={setFlashcardCandidates}
            onComplete={handleCandidatesComplete}
          />
        );

      case "manual-add":
        return <ManualFlashcardForm onSuccess={handleManualFlashcardSuccess} />;

      case "manage":
        return <FlashcardManager />;

      default:
        return <Quiz />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <AppNavigation currentView={currentView} onViewChange={setCurrentView} onSignOut={handleSignOut} />

      <main className="pb-20 md:pb-0">{renderCurrentView()}</main>
    </div>
  );
}
