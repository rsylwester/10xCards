import { useState, useEffect } from "react";
import { getUserFlashcards, generateQuizQuestion, getRandomFlashcard } from "../lib/quiz";
import type { QuizQuestion } from "../lib/quiz";
import type { Flashcard } from "../lib/supabase";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { BookOpen, RotateCcw } from "lucide-react";

export function Quiz() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  useEffect(() => {
    loadFlashcards();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadFlashcards = async () => {
    try {
      setLoading(true);
      const cards = await getUserFlashcards();
      setFlashcards(cards);

      if (cards.length > 0) {
        generateNextQuestion(cards);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error loading flashcards:", err);
      setError(err instanceof Error ? err.message : "Failed to load flashcards");
    } finally {
      setLoading(false);
    }
  };

  const generateNextQuestion = (availableCards?: Flashcard[]) => {
    const cards = availableCards || flashcards;

    if (cards.length === 0) {
      setError("No flashcards available. Add some flashcards to start the quiz.");
      return;
    }

    try {
      const randomCard = getRandomFlashcard(cards);
      const question = generateQuizQuestion(randomCard, cards);
      setCurrentQuestion(question);
      setSelectedAnswer(null);
      setShowResult(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error generating question:", err);
      setError("Failed to generate quiz question");
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return; // Prevent changing answer after selection

    setSelectedAnswer(answer);
    setShowResult(true);
    setQuestionsAnswered((prev) => prev + 1);

    if (answer === currentQuestion?.correctAnswer) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    generateNextQuestion();
  };

  const resetStats = () => {
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-6 bg-gray-800 border-gray-700">
          <div className="text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <h2 className="text-xl font-bold text-white mb-2">Quiz Unavailable</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <Button onClick={loadFlashcards} className="bg-blue-600 hover:bg-blue-700 text-white">
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-6 bg-gray-800 border-gray-700">
          <div className="text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <h2 className="text-xl font-bold text-white mb-2">No Flashcards Available</h2>
            <p className="text-gray-400">Add some flashcards to start the quiz.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-6 bg-gray-800 border-gray-700">
        {/* Quiz Stats */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-white">
            <h2 className="text-2xl font-bold">Quiz</h2>
            <p className="text-gray-400 text-sm">Test your vocabulary knowledge</p>
          </div>
          <div className="text-right">
            <div className="text-white text-sm">
              Score: {correctAnswers}/{questionsAnswered}
              {questionsAnswered > 0 && (
                <span className="text-gray-400 ml-2">({Math.round((correctAnswers / questionsAnswered) * 100)}%)</span>
              )}
            </div>
            {questionsAnswered > 0 && (
              <Button
                onClick={resetStats}
                size="sm"
                variant="outline"
                className="mt-1 border-gray-500 text-gray-400 hover:bg-gray-700"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h3 className="text-lg text-gray-400 mb-2">What does this mean?</h3>
            <div className="text-3xl font-bold text-blue-400">{currentQuestion.flashcard.front}</div>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              const isIncorrect = showResult && isSelected && !isCorrect;
              const shouldHighlightCorrect = showResult && isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    showResult
                      ? isIncorrect
                        ? "bg-red-900/50 border-red-500 text-red-200"
                        : shouldHighlightCorrect
                          ? "bg-green-900/50 border-green-500 text-green-200"
                          : "bg-gray-700 border-gray-600 text-gray-300"
                      : isSelected
                        ? "bg-blue-900/50 border-blue-500 text-blue-200"
                        : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500"
                  } ${showResult ? "cursor-default" : "cursor-pointer"}`}
                >
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                  <span className="ml-2">{option}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Next Button */}
        {showResult && (
          <div className="text-center">
            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              Next Question
            </Button>
          </div>
        )}

        {/* Instructions */}
        {!showResult && (
          <div className="mt-6 p-4 bg-gray-900/50 rounded border border-gray-700">
            <p className="text-gray-400 text-sm text-center">
              Choose the correct Polish translation for the English word above.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
