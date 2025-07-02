"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setToken("");
    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
      if (data.token) setToken(data.token); // For demo
    } else {
      setError(data.error || "Request failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleForgot}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Forgot Password
        </h1>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {message && <div className="text-green-600 text-sm">{message}</div>}
        {token && (
          <div className="text-xs text-gray-500 break-all">
            <strong>Reset Token (for demo):</strong>
            <div>{token}</div>
            <div>
              Use this link:{" "}
              <a
                className="text-blue-600 underline"
                href={`/reset?token=${token}`}
              >{`/reset?token=${token}`}</a>
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Send Reset Link
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
