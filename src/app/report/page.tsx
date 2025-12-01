"use client";

import { useState } from "react";

const CAMPUSES = [
  { slug: "atu-galway", name: "ATU Galway" },
  { slug: "nuig-galway", name: "University of Galway" },
];

export default function ReportItemPage() {
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

    try {
      const res = await fetch("/api/report", { method: "POST", body: data });
      if (!res.ok) throw new Error(await res.text());
      setSuccess("Your item report has been submitted successfully!");
      form.reset();
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen py-12 px-4">
      <div className="mx-auto max-w-3xl">
        
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800">
            Report a Found Item
          </h1>
          <p className="mt-3 text-slate-500 text-lg max-w-xl mx-auto">
            Help students recover their lost belongings by reporting found items.
            Please fill in the details below.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-lg ring-1 ring-slate-200 p-8 md:p-10">
          <form onSubmit={onSubmit} className="grid gap-6">

            {/* Campus */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Campus *
              </label>
              <select
                name="campus"
                required
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 shadow-sm focus:ring-2 focus:ring-sky-600 focus:outline-none transition"
              >
                <option value="">Select a campus…</option>
                {CAMPUSES.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            {/* Lost or Found */}
<div>
  <label className="block text-sm font-semibold text-slate-700 mb-1">
    Is this a lost or found item? *
  </label>

  <select
    name="status"
    required
    className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 shadow-sm 
               focus:ring-2 focus:ring-sky-600 transition"
  >
    <option value="">Select…</option>
    <option value="lost">Lost item</option>
    <option value="found">Found item</option>
  </select>
</div>


            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Item Title *
              </label>
              <input
                name="title"
                required
                placeholder="e.g., Black Wallet"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 shadow-sm focus:ring-2 focus:ring-sky-600 focus:outline-none transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                placeholder="Brand, colour, unique features…"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 shadow-sm focus:ring-2 focus:ring-sky-600 focus:outline-none transition"
              />
            </div>

            {/* Category + Date */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 shadow-sm focus:ring-2 focus:ring-sky-600 focus:outline-none transition"
                >
                  <option value="">Select…</option>
                  <option>Electronics</option>
                  <option>Wallet / ID</option>
                  <option>Keys</option>
                  <option>Clothing</option>
                  <option>Accessories</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Date Found *
                </label>
                <input
                  type="date"
                  name="dateFound"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 shadow-sm focus:ring-2 focus:ring-sky-600 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Where did you find it? *
              </label>
              <input
                name="location"
                required
                placeholder="e.g., Library ground floor, beside printers"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 shadow-sm focus:ring-2 focus:ring-sky-600 focus:outline-none transition"
              />
            </div>

            {/* Contact */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Your Name *
                </label>
                <input
                  name="contactName"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 shadow-sm focus:ring-2 focus:ring-sky-600 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Your Email *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 shadow-sm focus:ring-2 focus:ring-sky-600 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Photo (optional)
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-200 file:px-4 file:py-2 file:text-slate-700 hover:file:bg-slate-300 transition"
              />
            </div>

            {/* Submit Button */}
            <button
              disabled={submitting}
              className="mt-4 rounded-xl bg-sky-700/90 py-3.5 px-6 text-white text-lg font-semibold shadow-md hover:bg-sky-600 transition disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit Report"}
            </button>

            {/* Status Messages */}
            {success && (
              <div className="rounded-xl bg-green-50 p-4 text-green-700 text-center font-medium">
                {success}
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-red-700 text-center font-medium">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
