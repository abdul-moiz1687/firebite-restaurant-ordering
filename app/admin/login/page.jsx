"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  inMemoryPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await setPersistence(auth, inMemoryPersistence);

      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const idToken = await credential.user.getIdToken(true);

      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        credentials: "same-origin",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Admin login failed.");
      }

      await signOut(auth);

      router.replace("/admin");
      router.refresh();
    } catch {
      try {
        await signOut(auth);
      } catch {
        // Ignore client sign-out errors.
      }

      setError(
        "Login failed. Check your details and admin authorization."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffdf9] px-5 py-12">
      <section className="w-full max-w-md rounded-3xl border border-[#eee5d9] bg-white p-8 shadow-xl sm:p-10">
        <p className="mb-3 text-sm font-bold tracking-[0.2em] text-orange-600">
          FIREBITE MANAGEMENT
        </p>

        <h1 className="text-3xl font-bold text-[#25211d]">
          Admin Login
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Sign in to manage restaurant operations.
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              placeholder="Admin email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#f97316] px-4 py-3 font-semibold text-white transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}