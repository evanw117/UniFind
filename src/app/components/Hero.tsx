"use client";

import Container from "../../ui/Container";
import { Smartphone, Key, Shirt, Laptop, Tag, Briefcase } from "lucide-react";
import React from "react";

export default function Hero() {
  // CONFIG: x = horizontal spread (shifted -20 for centering), y = vertical dip (lowered).
  const icons = [
    { component: <Smartphone />, color: "text-[#F5B700]", x: -420, y: 110, delay: 0.1 },
    { component: <Key />, color: "text-white/60", x: -300, y: 210, delay: 0.2 },
    { component: <Shirt />, color: "text-[#F5B700]", x: -180, y: 280, delay: 0.3 },
    { component: <Tag />, color: "text-white/80", x: -20, y: 310, delay: 0.4 }, // Center point shifted
    { component: <Briefcase />, color: "text-[#F5B700]", x: 140, y: 280, delay: 0.5 },
    { component: <Laptop />, color: "text-white/60", x: 260, y: 210, delay: 0.6 },
    { component: <Key />, color: "text-[#F5B700]", x: 380, y: 110, delay: 0.7 },
  ];

  return (
    <section className="relative -mt-24 min-h-[calc(100vh-6rem)] pt-24 flex flex-col justify-between bg-[linear-gradient(180deg,#4B7C9B_0%,#6ea4bf_100%)] overflow-hidden">
      
      {/* 1. Main Content Area */}
      <div className="flex-grow flex flex-col justify-center items-center">
        <Container className="relative z-10 text-center text-white flex flex-col items-center">
          
          {/* 2. Text Content Wrapper */}
          <div className="relative inline-block mb-12">
            <h1 className="text-[clamp(64px,12vw,110px)] font-black tracking-tighter mb-2 drop-shadow-2xl">
              UniFind
            </h1>
            <div className="h-2 w-28 bg-white/20 mx-auto rounded-full mb-8 shadow-lg" />

            <p className="mx-auto max-w-2xl text-white/95 text-xl md:text-2xl font-semibold leading-relaxed drop-shadow-md px-4">
              Lost something on campus? Found an item? <br/>
              Your go-to platform for lost and found items at <br/>
              <span className="text-[#F5B700]">ATU Galway</span> and <span className="text-[#F5B700]">University of Galway</span>.
            </p>

            {/* 3. CENTERED & LOWERED LOOPING ICONS */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
              {icons.map((item, index) => (
                <div
                  key={index}
                  className="absolute animate-icon-arc"
                  style={{
                    left: `calc(50% + ${item.x}px)`,
                    top: `calc(50% + ${item.y}px)`,
                    animationDelay: `${item.delay}s`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className={`${item.color} filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] hover:scale-110 transition-transform cursor-pointer pointer-events-auto`}>
                    {React.cloneElement(item.component as React.ReactElement<{size?: number; strokeWidth?: number}>, { 
                      size: 60, 
                      strokeWidth: 1.2 
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* 4. ANIMATED WAVE */}
      <div className="relative h-[140px] w-full overflow-hidden">
        <div className="absolute inset-0 flex w-[200%] h-full animate-wave">
          <svg viewBox="0 0 1440 120" className="block w-1/2 h-full text-white" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,64 C240,128 360,0 720,64 C1080,128 1200,0 1440,64 L1440,120 L0,120 Z" />
          </svg>
          <svg viewBox="0 0 1440 120" className="block w-1/2 h-full text-white" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,64 C240,128 360,0 720,64 C1080,128 1200,0 1440,64 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </div>

    </section>
  );
}