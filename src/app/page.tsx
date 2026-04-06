// src/app/page.tsx
import React from "react";
import Link from "next/link";

// Assuming these components exist in your project
import Hero from "./components/Hero";
import { Features, ARBoard, Rewards } from "./components/Sections";
import Footer from "./Footer";

/* ----------------------- HOW IT WORKS ----------------------- */
const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: "Report with AI",
      desc: "Upload a photo. Our AI identifies the item and suggests a Reward Point value instantly based on its importance.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 012 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "from-sky-500 to-blue-600",
    },
    {
      title: "Smart Search",
      desc: "Browse by campus. Our semantic search finds matches even if the descriptions differ slightly from what you type.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      color: "from-purple-500 to-indigo-600",
    },
    {
      title: "Earn Rewards",
      desc: "Once an item is reunited, collect your points and redeem them for treats at the SU shop or canteen.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-amber-400 to-orange-500",
    },
  ];

  return (
    <section className="relative bg-white py-24 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse delay-700" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600 mb-4">Process</h2>
          <p className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Reuniting items in <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">3 simple steps</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Large background number */}
              <div className="absolute -top-10 -left-6 text-[120px] font-black text-slate-100/60 select-none group-hover:text-sky-50 transition-colors duration-500">
                {index + 1}
              </div>

              <div className="relative flex flex-col p-10 rounded-[32px] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl group-hover:border-sky-100">
                <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg mb-8 transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110`}>
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed text-lg">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* -------------------- CTA: LOST OR FOUND? -------------------- */
const LostOrFoundCTA: React.FC = () => {
  return (
    <section className="bg-white py-12 relative overflow-hidden">
      {/* Soft Background Orbs - Ice Blue & Mint */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-cyan-50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-sky-50 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-4">
        <div className="group relative rounded-[40px] bg-white/40 border border-white/80 p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl text-center transition-all duration-500 hover:shadow-[0_20px_50px_rgba(186,230,253,0.3)] hover:bg-white/60">
          
          {/* Subtle Icon Badge */}
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-50 to-sky-100 text-sky-600 shadow-sm border border-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-800 mb-4">
            Lost or <span className="text-sky-500">Found?</span>
          </h2>
          
          <p className="max-w-xl mx-auto text-slate-500 font-medium mb-10 leading-relaxed">
            Quickly report found items to earn rewards, or search the 
            live campus database to find what you've lost.
          </p>

          {/* THE COMPACT DUAL-ACTION POD */}
          <div className="inline-flex flex-col sm:flex-row p-2 rounded-[24px] bg-slate-100/50 border border-slate-200/50 backdrop-blur-md gap-2">
            
            <Link
              href="/campus/select/report"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-[18px] bg-sky-600 text-white font-bold text-sm shadow-lg shadow-sky-200 transition-all hover:bg-sky-500 hover:scale-[1.02] active:scale-95"
            >
              Report Item
              <span className="text-sky-200">/</span>
              <span className="text-xs opacity-90">+500 pts</span>
            </Link>

            <Link
              href="/campus/select/lost"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-[18px] bg-white text-slate-700 font-bold text-sm border border-slate-200 shadow-sm transition-all hover:bg-slate-50 hover:border-sky-200 active:scale-95"
            >
              <svg className="h-4 w-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search All
            </Link>

          </div>

          {/* Bottom Trust Line */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-slate-200" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ATU & Galway Uni</span>
            <div className="h-px w-8 bg-slate-200" />
          </div>

        </div>
      </div>
    </section>
  );
};

/* --------------------------- PAGE --------------------------- */
export default function HomePage() {
  return (
    <div className="bg-white">
      <Hero />
      <HowItWorks />
      <LostOrFoundCTA />
      <Features />
      <Rewards />
      <ARBoard />
      <Footer />
    </div>
  );
}