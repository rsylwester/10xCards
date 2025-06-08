import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { signUp, signIn, signOut, getCurrentUser, resetPassword } from "./auth";
import { supabase } from "./supabase";

describe("Auth Integration Tests", () => {
  const testEmail = "integration-test@example.com";
  const testPassword = "testpassword123";
  let testUserId: string | null = null;

  beforeAll(async () => {
    // Ensure we're using the test environment
    // eslint-disable-next-line no-console
    console.log("Starting auth integration tests...");
    // eslint-disable-next-line no-console
    console.log("Supabase URL:", import.meta.env.PUBLIC_SUPABASE_URL);
    // eslint-disable-next-line no-console
    console.log("Supabase Key:", import.meta.env.PUBLIC_SUPABASE_ANON_KEY ? "Present" : "Missing");
  });

  afterAll(async () => {
    // Clean up test user if created
    if (testUserId) {
      try {
        await supabase.auth.admin.deleteUser(testUserId);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("Failed to delete test user:", error);
      }
    }
  });

  beforeEach(async () => {
    // Sign out before each test to ensure clean state
    await signOut();
  });

  it("should sign up a new user", async () => {
    const result = await signUp(testEmail, testPassword);

    if (result.error) {
      // If user already exists, that's fine for testing
      expect(result.error.message).toMatch(/already|exists/i);
    } else {
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe(testEmail);
      testUserId = result.user?.id || null;
    }
  });

  it("should sign in with correct credentials", async () => {
    // First ensure user exists
    await signUp(testEmail, testPassword);

    const result = await signIn(testEmail, testPassword);

    expect(result.user).toBeDefined();
    expect(result.user?.email).toBe(testEmail);
    expect(result.error).toBeUndefined();
  });

  it("should fail to sign in with incorrect credentials", async () => {
    const result = await signIn(testEmail, "wrongpassword");

    expect(result.user).toBeUndefined();
    expect(result.error).toBeDefined();
    expect(result.error?.message).toMatch(/invalid|credentials|password/i);
  });

  it("should get current user when signed in", async () => {
    // First create the test user for this test
    await signUp(testEmail, testPassword);

    // Sign in first
    const signInResult = await signIn(testEmail, testPassword);
    expect(signInResult.user).toBeDefined();

    const user = await getCurrentUser();
    expect(user).toBeDefined();
    expect(user?.email).toBe(testEmail);
  });

  it("should return null when no user is signed in", async () => {
    await signOut();

    const user = await getCurrentUser();
    expect(user).toBeNull();
  });

  it("should successfully sign out", async () => {
    // First create and sign in a user
    await signUp(testEmail, testPassword);
    await signIn(testEmail, testPassword);

    // Verify user is signed in
    let user = await getCurrentUser();
    expect(user).toBeDefined();

    // Sign out
    const result = await signOut();
    expect(result.error).toBeUndefined();

    // Verify user is signed out
    user = await getCurrentUser();
    expect(user).toBeNull();
  });

  it("should send password reset email", async () => {
    // First ensure user exists
    await signUp(testEmail, testPassword);

    const result = await resetPassword(testEmail);

    // Password reset should succeed (even in test environment)
    expect(result.error).toBeUndefined();
  });

  it("should handle password reset for non-existent email", async () => {
    const result = await resetPassword("nonexistent@example.com");

    // Supabase typically doesn't reveal if email exists for security
    // So this should still succeed
    expect(result.error).toBeUndefined();
  });
});
