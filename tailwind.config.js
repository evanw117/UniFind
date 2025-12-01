/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Verify these paths match your project structure!
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", 
    // Add any other directories containing your files
  ],
  theme: {
    extend: {
      // --- ADD THIS BLOCK ---
      keyframes: {
        wave: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }, // Moves one full wave width
        },
      },
      animation: {
        // Now you can use the class 'animate-wave'
        'wave': 'wave 10s linear infinite', 
      },
      // --- END OF ADDED BLOCK ---
    },
  },
  plugins: [],
}