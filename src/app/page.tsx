// src/app/page.tsx
import React from "react";
import Link from "next/link";

import Hero from "./components/Hero";
import { Features, ARBoard, Rewards } from "./components/Sections";
import Footer from "./Footer";

/* ----------------------- HOW IT WORKS ----------------------- */
const HowItWorks: React.FC = () => {
  return (
    <section aria-labelledby="how-it-works" className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center">
          <h2
            id="how-it-works"
            className="text-3xl font-semibold tracking-tight text-slate-800 sm:text-4xl"
          >
            How It Works
          </h2>
          <p className="mt-3 text-slate-500">Simple, fast, and effective</p>
        </div>

        <div className="mt-12 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <article
            className="group rounded-2xl bg-white p-6 sm:p-7 shadow-sm ring-1 ring-slate-200/70 
            transition-all duration-300 hover:scale-[1.04] hover:shadow-xl hover:ring-sky-400/60"
          >
            <div
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-700/90 text-white shadow-sm 
              transition-colors duration-300 group-hover:bg-sky-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16V4m0 0l-3.5 3.5M12 4l3.5 3.5M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-800">Report</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Lost something? Found an item? Upload details and photos in seconds.
            </p>
          </article>

          {/* Card 2 */}
          <article
            className="group rounded-2xl bg-white p-6 sm:p-7 shadow-sm ring-1 ring-slate-200/70 
            transition-all duration-300 hover:scale-[1.04] hover:shadow-xl hover:ring-sky-400/60"
          >
            <div
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-700/90 text-white shadow-sm 
              transition-colors duration-300 group-hover:bg-sky-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-800">Search</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Browse through items by category, location, or university campus.
            </p>
          </article>

          {/* Card 3 */}
          <article
            className="group rounded-2xl bg-white p-6 sm:p-7 shadow-sm ring-1 ring-slate-200/70 
            transition-all duration-300 hover:scale-[1.04] hover:shadow-xl hover:ring-sky-400/60"
          >
            <div
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-700/90 text-white shadow-sm 
              transition-colors duration-300 group-hover:bg-sky-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-800">Connect</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Get in touch with the owner or finder and reunite with your items.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

/* -------------------- CTA: LOST OR FOUND? -------------------- */
const LostOrFoundCTA: React.FC = () => {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          className="relative mx-auto max-w-4xl rounded-[28px] px-6 py-12 sm:px-12 sm:py-14 shadow-[0_30px_80px_-25px_rgba(15,23,42,0.35)]"
          style={{
            backgroundImage:
              "linear-gradient(165deg, #3a7fa3 0%, #347696 40%, #2d6784 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* subtle inner ring for depth */}
          <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/15" />

          <div className="relative text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Lost or Found Something?
            </h2>
            <p className="mt-3 text-sky-100/90 max-w-2xl mx-auto leading-relaxed">
              Help reunite items with their owners. Every item reported makes our
              campus community stronger.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* ✅ Route to campus picker (report flow) */}
              <Link
                href="/campus/select/report"
                className="rounded-full bg-white text-sky-800 px-6 py-2.5 text-sm font-semibold shadow-[0_6px_14px_rgba(2,24,43,0.15)] hover:bg-slate-50 transition"
              >
                Report Lost Item
              </Link>

              {/* ✅ Also route to picker (report flow) */}
              <Link
                href="/campus/select/report"
                className="rounded-full bg-white/15 text-white px-6 py-2.5 text-sm font-semibold ring-1 ring-white/40 hover:bg-white/20 transition"
              >
                Report Found Item
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* --------------------------- PAGE --------------------------- */
export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <LostOrFoundCTA />
      <Features />
      <Rewards />
      <ARBoard />
      <Footer />
    </>
  );
}
