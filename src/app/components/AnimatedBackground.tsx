// src/app/components/AnimatedBackground.tsx

import React from 'react';



const AnimatedBackground: React.FC = () => {
  // Array to generate 10 "floating" circles/particles
  const circles = Array.from({ length: 10 });

  return (
    // The main container for the animation
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <ul className="absolute top-0 left-0 w-full h-full list-none p-0 m-0 z-0">
        {circles.map((_, index) => (
          <li
            key={index}
            // Uses the custom 'animate-float' utility
            className="absolute block bg-white/20 animate-float rounded-full"
            style={{
              // Custom CSS properties for each item to introduce variation
              width: `${Math.random() * 25 + 10}px`, // 10px to 35px
              height: `${Math.random() * 25 + 10}px`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 15}s`, // 15s to 25s
              animationDelay: `${Math.random() * 5}s`,
              bottom: '-150px', // Starts off-screen at the bottom
            }}
          />
        ))}
      </ul>
    </div>
  );
};

export default AnimatedBackground;
