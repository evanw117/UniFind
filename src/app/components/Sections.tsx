"use client";

import Container from "../../ui/Container";
// ⬅️ use the shared Container, not a local one

// ===== Features =====
// ===== Features =====
// ===== Features =====
export function Features() {
  const items: Array<{ icon: string; title: string; body: string }> = [
    {
      icon: "🔍",
      title: "Smart listings & search",
      body:
        "Browse unified posts from ATU & UoG. Filter by category, time, and location for fast matches.",
    },
    {
      icon: "📍",
      title: "Location details",
      body:
        "Every post includes where an item was found or last seen, helping narrow down the hunt.",
    },
    {
      icon: "🛡️",
      title: "Simple verification",
      body:
        "Ask claimants to describe items or unlock devices to prove ownership before handover.",
    },
    {
      icon: "⭐",
      title: "Rewards for returns",
      body:
        "Earn points or incentives for posting and returning found items — be a campus hero.",
    },
    {
      icon: "📱",
      title: "Responsive web app",
      body:
        "Fast, accessible and mobile-first. Works great on phones, tablets and desktops.",
    },
    {
      icon: "🧭",
      title: "Expand campus-wide",
      body:
        "Designed with scalability in mind so other campuses can plug in with ease.",
    },
  ];

  return (
    <section id="features" className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <header className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl sm:text-[28px] font-semibold tracking-tight text-slate-800">
            Built for busy students & staff
          </h2>
          <p className="mt-2 text-slate-500">
            A modern, scalable platform that unifies lost &amp; found across campuses with simple tools and smart tech.
          </p>
        </header>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon, title, body }) => (
            <article
              key={title}
              className="group rounded-2xl bg-white p-5 sm:p-6 ring-1 ring-slate-200/70 shadow-sm
                         transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:ring-sky-400/60"
            >
              <div className="flex items-start gap-4">
                <span
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl
                             bg-sky-700/90 text-white shadow-sm transition-colors duration-300
                             group-hover:bg-sky-600"
                  aria-hidden
                >
                  <span className="text-lg leading-none">{icon}</span>
                </span>

                <div>
                  <h3 className="text-[17px] sm:text-lg font-semibold text-slate-800">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-500">
                    {body}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== Rewards that give back =====
export function Rewards() {
  const items: Array<{ icon: string; title: string; body: string }> = [
    {
      icon: "🏅",
      title: "Earn points",
      body: "Get points for verified returns and helpful reports that include clear details.",
    },
    {
      icon: "🎁",
      title: "Redeem perks",
      body: "Perks could include campus café vouchers or merch — decided alongside SU partners.",
    },
    {
      icon: "📊",
      title: "Community impact",
      body: "See how many items were reunited this month across your campus.",
    },
  ];

  return (
    <section id="rewards" className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <header className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl sm:text-[28px] font-semibold tracking-tight text-slate-800">
            Rewards that give back
          </h2>
          <p className="mt-2 text-slate-500">Good deeds deserve a boost.</p>
        </header>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
          {items.map(({ icon, title, body }) => (
            <article
              key={title}
              className="group rounded-2xl bg-white p-5 sm:p-6 ring-1 ring-slate-200/70 shadow-sm
                         transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:ring-sky-400/60"
            >
              <div className="flex items-start gap-4">
                {/* icon chip */}
                <span
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl
                             bg-sky-700/90 text-white shadow-sm transition-colors duration-300
                             group-hover:bg-sky-600"
                  aria-hidden
                >
                  <span className="text-lg leading-none">{icon}</span>
                </span>

                <div>
                  <h3 className="text-[17px] sm:text-lg font-semibold text-slate-800">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-500">
                    {body}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== AR Lost & Found Board =====
export function ARBoard() {
  return (
    <section id="ar" className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <header className="mb-6 text-center sm:text-left">
          <h2 className="text-3xl sm:text-[28px] font-semibold tracking-tight text-slate-800">
            AR Lost &amp; Found Board
          </h2>
          <p className="mt-2 text-slate-500">
            Scan designated campus posters to reveal a virtual noticeboard right in your camera. See nearby posts and directions instantly.
          </p>
        </header>

        <div
          className="relative rounded-3xl p-6 sm:p-8 shadow-sm ring-1 ring-slate-200/70
                     bg-[linear-gradient(165deg,#3a7fa31a_0%,#6aa7c51a_100%)]
                     hover:shadow-xl hover:ring-sky-400/60 transition-all duration-300"
        >
          {/* subtle border accent */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/40" />

          <div className="relative grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-slate-600 leading-relaxed">
                Open your camera and scan a UniFind poster on campus. WebAR will launch in your browser — no app download needed.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => alert("WebAR demo coming soon")}
                className="rounded-full bg-sky-700/90 px-5 py-2.5 text-sm font-semibold text-white
                           shadow-[0_6px_14px_rgba(2,24,43,0.15)] hover:bg-sky-600 transition"
              >
                Launch WebAR
              </button>
              <a
                href="#how"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 ring-1 ring-slate-200
                           hover:bg-slate-50 transition"
              >
                Setup &amp; tips
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


