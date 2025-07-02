"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Password reset successful! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 1500);
    } else {
      setError(data.error || "Reset failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleReset}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Reset Password
        </h1>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {message && <div className="text-green-600 text-sm">{message}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Reset Password
        </button>
        <div className="text-sm text-center mt-2">
          <a href="/login" className="text-blue-600 hover:underline">
            Back to Login
          </a>
        </div>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-gray-600">Loading...</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
