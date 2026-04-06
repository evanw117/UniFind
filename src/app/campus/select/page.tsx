'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const CAMPUSES = [
  {
    slug: "atu-galway",
    short: "ATU Galway",
    name: "Atlantic Technological University",
    campus: "Dublin Road",
    logo: "/ATU-Logo.png",
    image: "/atu.png",
    accent: "#007BA7",
  },
  {
    slug: "nuig-galway",
    short: "University of Galway",
    name: "National University of Ireland",
    campus: "University Road",
    logo: "/University_of_Galway_logo.png",
    image: "/nui.png",
    accent: "#A31F34",
  },
];

export default function SelectCampusPage({ searchParams }: any) {
  const [activeHover, setActiveHover] = useState<string | null>(null);

  const raw = Array.isArray(searchParams?.type) ? searchParams?.type[0] : searchParams?.type;
  const type: "lost" | "found" | "report" = raw === "found" || raw === "report" ? raw : "lost";

  return (
    <main className="relative min-h-[90vh] w-full overflow-hidden bg-white flex items-center justify-center p-4">
      
      {/* BACKGROUND LAYER - Made more visible */}
      <div className="absolute inset-0 z-0">
        {CAMPUSES.map((c) => (
          <div
            key={c.slug}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              activeHover === c.slug ? "opacity-50 scale-110" : "opacity-0 scale-100"
            }`}
          >
            <Image 
              src={c.image} 
              alt="" 
              fill 
              className="object-cover" 
              priority 
            />
            {/* Reduced blur and slightly lighter white overlay to let image through */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[0.5px]" />
          </div>
        ))}
        <div className={`absolute inset-0 bg-slate-50 transition-opacity duration-500 ${activeHover ? 'opacity-0' : 'opacity-100'}`} />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 drop-shadow-sm">
            Select Your Campus
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Choose a location to continue</p>
        </header>

        <section className="grid w-full gap-6 md:grid-cols-2">
          {CAMPUSES.map((c) => {
            const href = `/campus/${c.slug}/${type}`;
            const isHovered = activeHover === c.slug;

            return (
              <article
                key={c.slug}
                onMouseEnter={() => setActiveHover(c.slug)}
                onMouseLeave={() => setActiveHover(null)}
                className="relative"
              >
                <Link href={href} className="block">
                  <div className={`relative rounded-3xl transition-all duration-300 p-8 flex flex-col items-center text-center
                    ${isHovered 
                      ? "bg-white/95 shadow-2xl scale-[1.02] border-white" 
                      : "bg-white/70 shadow-sm border-slate-100"} 
                    backdrop-blur-md border-[1px] h-[360px] justify-center`}
                  >
                    {/* Logo Section */}
                    <div className="relative h-24 w-24 mb-6 transition-transform duration-300 group-hover:scale-110">
                      <Image 
                        src={c.logo} 
                        alt={c.short} 
                        fill 
                        className={`object-contain transition-all duration-500 ${isHovered ? 'grayscale-0' : 'grayscale opacity-70'}`} 
                      />
                    </div>

                    <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{c.short}</h3>
                    <p className="text-slate-500 text-xs mt-1 mb-4 font-medium">{c.name}</p>

                    <div className="flex items-center gap-1.5 bg-slate-100/90 px-3 py-1.5 rounded-full border border-slate-200/50 mb-6">
                      <span className="text-xs font-semibold text-slate-700">📍 {c.campus}</span>
                    </div>

                    {/* Compact Button */}
                    <div 
                      className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md
                      ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
                      style={{ backgroundColor: c.accent }}
                    >
                      <span className="text-white text-lg font-bold">→</span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}