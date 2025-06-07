import { supabase } from "./supabase";
import type { Flashcard } from "./supabase";

interface QuizQuestion {
  flashcard: Flashcard;
  options: string[];
  correctAnswer: string;
}

const DISTRACTOR_TRANSLATIONS = [
  "Sceptyczny, wątpliwy",
  "Powierzchowny, płytki",
  "Spontaniczny, żywiołowy",
  "Konwencjonalny, tradycyjny",
  "Marginalny, drugorzędny",
  "Arbitralny, samowolny",
  "Tymczasowy, przejściowy",
  "Ewentualny, możliwy",
  "Definitywny, ostateczny",
  "Względny, proporcjonalny",
  "Abstrakcyjny, teoretyczny",
  "Konkretny, rzeczywisty",
  "Uniwersalny, powszechny",
  "Specjalny, szczególny",
  "Ogólny, powszechny",
  "Indywidualny, osobisty",
  "Zbiorowy, grupowy",
  "Lokalny, miejscowy",
  "Globalny, światowy",
  "Regionalny, obszarowy",
  "Narodowy, krajowy",
  "Międzynarodowy, zagraniczny",
  "Formalny, oficjalny",
  "Nieformalny, nieoficjalny",
  "Publiczny, społeczny",
  "Prywatny, osobisty",
  "Komercyjny, handlowy",
  "Naukowy, badawczy",
  "Praktyczny, użyteczny",
  "Teoretyczny, abstrakcyjny",
  "Empiryczny, doświadczalny",
  "Systematyczny, metodyczny",
  "Przypadkowy, losowy",
  "Celowy, zamierzony",
  "Automatyczny, samoczynny",
  "Manualny, ręczny",
  "Cyfrowy, elektroniczny",
  "Analogowy, ciągły",
  "Mechaniczny, maszynowy",
  "Organiczny, naturalny",
  "Sztuczny, syntetyczny",
  "Klasyczny, tradycyjny",
  "Nowoczesny, współczesny",
  "Archaiczny, przestarzały",
  "Przyszłościowy, futurystyczny",
  "Historyczny, dawny",
  "Współczesny, aktualny",
  "Pierwotny, początkowy",
  "Końcowy, ostateczny",
  "Pośredni, średni",
  "Bezpośredni, wprost",
  "Ewidentny, oczywisty",
  "Ukryty, skryty",
  "Jasny, przejrzysty",
  "Niejasny, mętny",
  "Klarowny, zrozumiały",
  "Skomplikowany, złożony",
  "Prosty, łatwy",
  "Trudny, ciężki",
  "Możliwy, osiągalny",
  "Niemożliwy, nieosiągalny",
];

export async function getUserFlashcards(): Promise<Flashcard[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase.from("flashcards").select("*").eq("user_id", user.id);

  if (error) {
    throw error;
  }

  return data || [];
}

export function generateQuizQuestion(flashcard: Flashcard, allFlashcards: Flashcard[]): QuizQuestion {
  const correctAnswer = flashcard.back;

  // Get potential distractors from other flashcards
  const otherFlashcards = allFlashcards.filter((fc) => fc.id !== flashcard.id).map((fc) => fc.back);

  // Combine with predefined distractors
  const allDistractors = [...otherFlashcards, ...DISTRACTOR_TRANSLATIONS].filter(
    (translation) => translation !== correctAnswer
  );

  // Shuffle and pick 3 unique distractors
  const shuffledDistractors = shuffleArray([...allDistractors]);
  const uniqueDistractors = [...new Set(shuffledDistractors)].slice(0, 3);

  // If we don't have enough unique distractors, pad with more from the list
  while (uniqueDistractors.length < 3 && uniqueDistractors.length < allDistractors.length) {
    const nextDistractor = allDistractors.find((d) => !uniqueDistractors.includes(d));
    if (nextDistractor) {
      uniqueDistractors.push(nextDistractor);
    } else {
      break;
    }
  }

  // Create options array with correct answer and distractors
  const options = [correctAnswer, ...uniqueDistractors.slice(0, 3)];

  // Shuffle the options
  const shuffledOptions = shuffleArray(options);

  return {
    flashcard,
    options: shuffledOptions,
    correctAnswer,
  };
}

export function getRandomFlashcard(flashcards: Flashcard[]): Flashcard {
  if (flashcards.length === 0) {
    throw new Error("No flashcards available");
  }

  const randomIndex = Math.floor(Math.random() * flashcards.length);
  return flashcards[randomIndex];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export type { QuizQuestion };
