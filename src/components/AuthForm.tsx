import { useState } from "react";
import { signIn, signUp, resetPassword } from "../lib/auth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";

interface AuthFormProps {
  onSuccess: () => void;
}

type FormMode = "signin" | "signup" | "reset";

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<FormMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === "signin") {
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error.message);
        } else {
          onSuccess();
        }
      } else if (mode === "signup") {
        const result = await signUp(email, password);
        if (result.error) {
          setError(result.error.message);
        } else {
          setMessage("Account created successfully! Please check your email to verify your account.");
        }
      } else if (mode === "reset") {
        const result = await resetPassword(email);
        if (result.error) {
          setError(result.error.message);
        } else {
          setMessage("Password reset email sent! Check your inbox.");
        }
      }
    } catch {
      setError("An unexpected error occurred");
    }

    setLoading(false);
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signIn("demo@example.com", "demopass");
      if (result.error) {
        setError(result.error.message);
      } else {
        onSuccess();
      }
    } catch {
      setError("Failed to login with demo account");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Card className="w-full max-w-md p-6 bg-gray-800 border-gray-700">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">FlashcardAI</h1>
          <p className="text-gray-400">
            {mode === "signin" && "Sign in to your account"}
            {mode === "signup" && "Create a new account"}
            {mode === "reset" && "Reset your password"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm">{error}</div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded text-green-300 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          {mode !== "reset" && (
            <div>
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {loading
              ? "Loading..."
              : mode === "signin"
                ? "Sign In"
                : mode === "signup"
                  ? "Sign Up"
                  : "Send Reset Email"}
          </Button>
        </form>

        {mode === "signin" && (
          <div className="mt-4">
            <Button
              onClick={handleDemoLogin}
              disabled={loading}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Try Demo Account
            </Button>
          </div>
        )}

        <div className="mt-6 text-center space-y-2">
          {mode === "signin" && (
            <>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Don&apos;t have an account? Sign up
              </button>
              <br />
              <button
                type="button"
                onClick={() => setMode("reset")}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Forgot password?
              </button>
            </>
          )}

          {mode === "signup" && (
            <button
              type="button"
              onClick={() => setMode("signin")}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Already have an account? Sign in
            </button>
          )}

          {mode === "reset" && (
            <button
              type="button"
              onClick={() => setMode("signin")}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Back to sign in
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
