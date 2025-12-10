import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Healthcare Theme (Navy Dark Theme)
        traditional: {
          bg: "#0f172a", // Slate 900 (Deep Navy Background)
          text: "#F8FAFC", // Slate 50
          subtext: "#94A3B8", // Slate 400
          primary: "#2DD4BF", // Teal 400
          secondary: "#3B82F6", // Blue 500
          accent: "#06B6D4", // Cyan 500
          muted: "#1e293b", // Slate 800 (Lighter Navy for borders)
          ai: "#6366F1", // Indigo 500
        },
        // Medical Theme (Unified Navy Theme)
        medical: {
          bg: "#0f172a", // Slate 900
          text: "#F8FAFC", // Slate 50
          subtext: "#94A3B8", // Slate 400
          primary: "#34D399", // Emerald 400
          secondary: "#10B981", // Emerald 500
          accent: "#60A5FA", // Blue 400
          muted: "#1f2937", // Gray 800
        },
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))',
        'glass-dark': 'linear-gradient(135deg, rgba(20, 20, 20, 0.8), rgba(20, 20, 20, 0.4))',
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"], // Keeping serif just in case for specific headers
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
