import { describe, it, expect, vi, beforeEach } from "vitest";
import { signUp, signIn, signOut, resetPassword } from "./auth";
import { supabase } from "./supabase";

// Mock Supabase
vi.mock("./supabase", () => {
  const mockSupabase = {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        error: null,
      })),
    })),
  };
  return { supabase: mockSupabase };
});

describe("auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("signUp", () => {
    it("should successfully sign up a user", async () => {
      const mockUser = { id: "user123", email: "test@example.com" };
      vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      const result = await signUp("test@example.com", "password123");

      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeUndefined();
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    it("should handle sign up errors", async () => {
      const mockError = { message: "Email already registered" };
      vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
        data: { user: null },
        error: mockError,
      });

      const result = await signUp("test@example.com", "password123");

      expect(result.user).toBeUndefined();
      expect(result.error).toEqual({ message: "Email already registered" });
    });

    it("should handle unexpected errors", async () => {
      vi.mocked(supabase.auth.signUp).mockRejectedValueOnce(new Error("Network error"));

      const result = await signUp("test@example.com", "password123");

      expect(result.error).toEqual({ message: "An unexpected error occurred" });
    });
  });

  describe("signIn", () => {
    it("should successfully sign in a user", async () => {
      const mockUser = { id: "user123", email: "test@example.com" };
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      const result = await signIn("test@example.com", "password123");

      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeUndefined();
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    it("should handle sign in errors", async () => {
      const mockError = { message: "Invalid credentials" };
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
        data: { user: null },
        error: mockError,
      });

      const result = await signIn("test@example.com", "wrongpassword");

      expect(result.user).toBeUndefined();
      expect(result.error).toEqual({ message: "Invalid credentials" });
    });
  });

  describe("signOut", () => {
    it("should successfully sign out", async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValueOnce({
        error: null,
      });

      const result = await signOut();

      expect(result.error).toBeUndefined();
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it("should handle sign out errors", async () => {
      const mockError = { message: "Sign out failed" };
      vi.mocked(supabase.auth.signOut).mockResolvedValueOnce({
        error: mockError,
      });

      const result = await signOut();

      expect(result.error).toEqual({ message: "Sign out failed" });
    });
  });

  describe("resetPassword", () => {
    it("should successfully send reset password email", async () => {
      vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValueOnce({
        error: null,
      });

      const result = await resetPassword("test@example.com");

      expect(result.error).toBeUndefined();
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith("test@example.com");
    });

    it("should handle reset password errors", async () => {
      const mockError = { message: "Email not found" };
      vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValueOnce({
        error: mockError,
      });

      const result = await resetPassword("test@example.com");

      expect(result.error).toEqual({ message: "Email not found" });
    });
  });
});
