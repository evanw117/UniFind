"use client";

import { useState } from "react";
import { useAuth } from "../AuthContext";

const CAMPUSES = [
  { slug: "atu-galway", name: "ATU Galway" },
  { slug: "nuig-galway", name: "University of Galway" },
];

type ReportApiResponse = {
  awarded_points?: number;
  estimated_return_points?: number | null;
  warning?: string | null;
  error?: string;
};

export default function ReportItemPage() {
  const { session } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    if (session?.access_token) {
      data.set("accessToken", session.access_token);
    }

    try {
      const res = await fetch("/api/report", { method: "POST", body: data });
      const payload = (await res.json().catch(() => null)) as ReportApiResponse | null;

      if (!res.ok) {
        throw new Error(payload?.error || "Something went wrong.");
      }

      const successParts = ["Your item report has been submitted successfully!"];

      if (typeof payload?.estimated_return_points === "number") {
        successParts.push(`Estimated return reward: ${payload.estimated_return_points} points.`);
      }

      if (typeof payload?.awarded_points === "number" && payload.awarded_points > 0) {
        successParts.push(`You earned ${payload.awarded_points} report points.`);
      }

      if (payload?.warning) {
        successParts.push(payload.warning);
      }

      setSuccess(successParts.join(" "));
      form.reset();
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-slate-800">Report a Found Item</h1>
          <p className="mx-auto mt-3 max-w-xl text-lg text-slate-500">
            Help students recover their lost belongings by reporting found items.
            Please fill in the details below.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200 md:p-10">
          <form onSubmit={onSubmit} className="grid gap-6">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Campus *
              </label>
              <select
                name="campus"
                required
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-sky-600"
              >
                <option value="">Select a campus...</option>
                {CAMPUSES.map((campus) => (
                  <option key={campus.slug} value={campus.slug}>
                    {campus.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Is this a lost or found item? *
              </label>
              <select
                name="status"
                required
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 shadow-sm transition focus:ring-2 focus:ring-sky-600"
              >
                <option value="">Select...</option>
                <option value="lost">Lost item</option>
                <option value="found">Found item</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Item Title *
              </label>
              <input
                name="title"
                required
                placeholder="e.g., Black Wallet"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                placeholder="Brand, colour, unique features..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-sky-600"
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
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Date Found *
                </label>
                <input
                  type="date"
                  name="dateFound"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Where did you find it? *
              </label>
              <input
                name="location"
                required
                placeholder="e.g., Library ground floor, beside printers"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Your Name *
                </label>
                <input
                  name="contactName"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Your Email *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Photo (optional)
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-200 file:px-4 file:py-2 file:text-slate-700 transition hover:file:bg-slate-300"
              />
            </div>

            <button
              disabled={submitting}
              className="mt-4 rounded-xl bg-sky-700/90 px-6 py-3.5 text-lg font-semibold text-white shadow-md transition hover:bg-sky-600 disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Report"}
            </button>

            {success && (
              <div className="rounded-xl bg-green-50 p-4 text-center font-medium text-green-700">
                {success}
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-center font-medium text-red-700">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
