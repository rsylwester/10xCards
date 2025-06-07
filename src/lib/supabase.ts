import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Flashcard {
  id: string;
  user_id: string;
  front: string;
  back: string;
  source: "ai" | "manual" | "default";
  created_at: string;
  updated_at: string;
}

export type FlashcardInsert = Omit<Flashcard, "id" | "user_id" | "created_at" | "updated_at">;
export type FlashcardUpdate = Partial<Pick<Flashcard, "front" | "back">>;
