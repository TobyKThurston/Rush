import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./types/**/*.{ts,tsx}",
    "./styles/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#F8F6F2",
        charcoal: "#1C1C1C",
        rosegold: "#C6A77D",
        warmGrey: "#B8AEA0",
        mist: "#E6E1D9"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "serif"]
      },
      boxShadow: {
        veil: "0 20px 60px rgba(28, 28, 28, 0.08)",
        subtle: "0 10px 30px rgba(28, 28, 28, 0.05)"
      },
      transitionTimingFunction: {
        gentle: "cubic-bezier(0.4, 0.0, 0.2, 1)"
      }
    }
  },
  plugins: []
};

export default config;
