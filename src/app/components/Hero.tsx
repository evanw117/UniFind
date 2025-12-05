// hero.tsx
"use client";

import Container from "../../ui/Container";
import { Search } from "lucide-react";
import React from "react"; // Explicit import for React if not using automatic JSX runtime

export default function Hero() {
  
  const nextSectionBgColor = "text-white"; 

  return (
    <section className="relative overflow-hidden">
      {/* Hero Content Background */}
      <div className="bg-[linear-gradient(180deg,#4B7C9B,40%,#6ea4bf)] text-white">

        <Container className="py-20 md:py-28 text-center">
          
          {/* small accent icon */}
          <div className="mx-auto mb-4 flex items-center justify-center">
            <div className="p-3 rounded-full bg-white/20 backdrop-blur-md shadow-lg">
              <Search className="w-7 h-7 text-white" />
            </div>
          </div>

          <h1 className="text-[clamp(38px,6vw,60px)] font-bold tracking-tight">
            UniFind
          </h1>

          <div className="mt-4 h-1 w-20 mx-auto bg-white/30 rounded-full" />

          <p className="mx-auto mt-4 max-w-2xl text-white/90 text-lg">
            Lost something on campus? Found an item?  
            Your go-to platform for lost and found items at ATU Galway and University of Galway.
          </p>
        </Container>

        {/* --- ANIMATED WAVE CONTAINER --- */}
       
        <div className="relative h-[120px] overflow-hidden">
            
            {/* Wave Track: Double the width (w-[200%]) and apply the custom animation class */}
            <div className="absolute inset-0 flex w-[200%] h-full animate-wave">
                
                {/* Wave 1: Fills half the track (w-1/2) */}
                <svg
                    viewBox="0 0 1440 120"
                    className={`block w-1/2 h-full ${nextSectionBgColor}`}
                    aria-hidden="true"
                    preserveAspectRatio="none"
                >
                    <path
                        fill="currentColor"
                        d="M0,64 C240,128 360,0 720,64 C1080,128 1200,0 1440,64 L1440,120 L0,120 Z"
                    />
                </svg>

                {/* Wave 2: Identical to Wave 1, ensuring a seamless loop */}
                <svg
                    viewBox="0 0 1440 120"
                    className={`block w-1/2 h-full ${nextSectionBgColor}`}
                    aria-hidden="true"
                    preserveAspectRatio="none"
                >
                    <path
                        fill="currentColor"
                        d="M0,64 C240,128 360,0 720,64 C1080,128 1200,0 1440,64 L1440,120 L0,120 Z"
                    />
                </svg>
            </div>
        </div>
      </div>
    </section>
  );
}
