"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/app/AuthContext";

const VALID = new Set(["atu-galway", "nuig-galway"] as const);

const pretty = (s: string) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

type ReportResponse = {
  success: boolean;
  awarded_points: number;
  estimated_return_points: number | null;
  item_value_tier: "low" | "medium" | "high" | null;
  classification_reason: string | null;
  warning?: string | null;
};

export default function ReportItemPage() {
  const { session } = useAuth();
  const params = useParams<{ slug: string | string[] }>();
  const slug =
    typeof params.slug === "string"
      ? params.slug
      : Array.isArray(params.slug)
        ? params.slug[0]
        : "";

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!slug || !VALID.has(slug as "atu-galway" | "nuig-galway")) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Campus not found</h1>
        <p className="mt-2 text-slate-600">
          Please go back and select a valid campus.
        </p>
        <Link
          href="/campus/select?type=report"
          className="mt-6 inline-flex rounded-full bg-sky-700/90 px-5 py-3 font-semibold text-white transition hover:bg-sky-600"
        >
          Back to campus select
        </Link>
      </main>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("campus", slug);
    data.set("status", "found");

    if (session?.access_token) {
      data.set("accessToken", session.access_token);
    }

    try {
      const response = await fetch("/api/report", {
        method: "POST",
        body: data,
      });

      const payload = (await response.json()) as ReportResponse | { error?: string };

      if (!response.ok || !("success" in payload)) {
        throw new Error(
          "error" in payload
            ? payload.error || "Unable to submit report."
            : "Unable to submit report.",
        );
      }

      const successMessageParts = ["Thanks! Your report was submitted."];

      if (payload.estimated_return_points) {
        successMessageParts.push(
          `Estimated return reward: ${payload.estimated_return_points} points.`,
        );
      }

      if (payload.awarded_points > 0) {
        successMessageParts.push(`You earned ${payload.awarded_points} report points.`);
      }

      if (payload.warning) {
        successMessageParts.push(payload.warning);
      }

      setSuccess(successMessageParts.join(" "));
      form.reset();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <nav className="text-sm text-slate-500">
          <Link href="/campus/select?type=report" className="hover:underline">
            Select Campus
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-slate-700">{pretty(slug)}</span>
          <span className="mx-2">/</span>
          <span className="font-semibold text-slate-700">Report Item</span>
        </nav>

        <header className="mt-4">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-800">
            Report a found item - {pretty(slug)}
          </h1>
          <p className="mt-2 text-slate-500">
            Fill in the details so the owner can find it quickly.
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 sm:p-8"
        >
          <div className="grid gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Item title *
              </label>
              <input
                name="title"
                required
                placeholder="e.g., Black wallet"
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                placeholder="Brand, colour, distinct features..."
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-600"
                >
                  <option value="">Select...</option>
                  <option>Electronics</option>
                  <option>Wallet / ID</option>
                  <option>Keys</option>
                  <option>Clothing</option>
                  <option>Accessories</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Date found *
                </label>
                <input
                  type="date"
                  name="dateFound"
                  required
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Where did you find it? *
              </label>
              <input
                name="location"
                required
                placeholder="e.g., Library ground floor, near printers"
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Your name *
                </label>
                <input
                  name="contactName"
                  required
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Your email *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  required
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Photo (optional)
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="mt-1 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-slate-700 hover:file:bg-slate-200"
              />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" required className="h-4 w-4" />
              <span className="text-sm text-slate-600">
                I confirm the information is accurate.
              </span>
            </div>

            {success && (
              <div className="rounded-xl bg-green-50 p-3 text-green-700">
                {success}
              </div>
            )}
            {error && (
              <div className="rounded-xl bg-red-50 p-3 text-red-700">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                disabled={submitting}
                className="rounded-full bg-sky-700/90 px-6 py-3.5 font-semibold text-white shadow hover:bg-sky-600 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit report"}
              </button>
              <Link
                href={`/campus/${slug}/lost`}
                className="text-slate-600 hover:text-slate-800"
              >
                View lost items for {pretty(slug)}
              </Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
