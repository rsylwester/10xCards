import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

export interface AuthError {
  message: string;
}

export interface AuthResult {
  user?: User;
  error?: AuthError;
}

export async function signUp(email: string, password: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { error: { message: error.message } };
    }

    if (data.user) {
      // Create default flashcards for new user
      await createDefaultFlashcards(data.user.id);
    }

    return { user: data.user };
  } catch {
    return { error: { message: "An unexpected error occurred" } };
  }
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: { message: error.message } };
    }

    return { user: data.user };
  } catch {
    return { error: { message: "An unexpected error occurred" } };
  }
}

export async function signOut(): Promise<{ error?: AuthError }> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: { message: error.message } };
    }

    return {};
  } catch {
    return { error: { message: "An unexpected error occurred" } };
  }
}

export async function resetPassword(email: string): Promise<{ error?: AuthError }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      return { error: { message: error.message } };
    }

    return {};
  } catch {
    return { error: { message: "An unexpected error occurred" } };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting current user:", error);
    return null;
  }
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null);
  });
}

async function createDefaultFlashcards(userId: string) {
  const defaultFlashcards = [
    { front: "Sophisticated", back: "Wyrafinowany, skomplikowany", source: "default" },
    { front: "Prevalent", back: "Powszechny, rozpowszechniony", source: "default" },
    { front: "Comprehensive", back: "Kompleksowy, wyczerpujący", source: "default" },
    { front: "Substantial", back: "Znaczny, istotny", source: "default" },
    { front: "Elaborate", back: "Rozbudowany, szczegółowy", source: "default" },
    { front: "Inevitable", back: "Nieunikniony, nieuchronny", source: "default" },
    { front: "Profound", back: "Głęboki, dogłębny", source: "default" },
    { front: "Resilient", back: "Odporny, elastyczny", source: "default" },
    { front: "Compelling", back: "Przekonujący, porywający", source: "default" },
    { front: "Versatile", back: "Wszechstronny, uniwersalny", source: "default" },
    { front: "Feasible", back: "Wykonalny, możliwy do zrealizowania", source: "default" },
    { front: "Coherent", back: "Spójny, logiczny", source: "default" },
    { front: "Pragmatic", back: "Pragmatyczny, praktyczny", source: "default" },
    { front: "Ambiguous", back: "Niejednoznaczny, dwuznaczny", source: "default" },
    { front: "Innovative", back: "Innowacyjny, nowatorski", source: "default" },
    { front: "Discrepancy", back: "Rozbieżność, niezgodność", source: "default" },
    { front: "Hierarchy", back: "Hierarchia, porządek", source: "default" },
    { front: "Paradigm", back: "Paradygmat, wzorzec", source: "default" },
    { front: "Nevertheless", back: "Niemniej jednak, mimo to", source: "default" },
    { front: "Furthermore", back: "Ponadto, co więcej", source: "default" },
    { front: "Subsequently", back: "Następnie, w dalszej kolejności", source: "default" },
    { front: "Consequently", back: "W konsekwencji, w rezultacie", source: "default" },
    { front: "Presumably", back: "Prawdopodobnie, przypuszczalnie", source: "default" },
    { front: "Predominantly", back: "Przeważnie, głównie", source: "default" },
    { front: "Approximately", back: "Około, w przybliżeniu", source: "default" },
  ];

  try {
    const flashcardsWithUserId = defaultFlashcards.map((card) => ({
      ...card,
      user_id: userId,
    }));

    const { error } = await supabase.from("flashcards").insert(flashcardsWithUserId);

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Error creating default flashcards:", error);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating default flashcards:", error);
  }
}
