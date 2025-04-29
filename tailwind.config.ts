import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        neon: {
          purple: "hsl(var(--neon-purple))",
          pink: "hsl(var(--neon-pink))",
          blue: "hsl(var(--neon-blue))",
          cyan: "hsl(var(--neon-cyan))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "spin-glow": {
          "0%": {
            transform: "rotate(0deg)",
            boxShadow: "0 0 10px hsl(var(--neon-purple)), 0 0 20px hsl(var(--neon-purple))",
          },
          "50%": {
            boxShadow: "0 0 20px hsl(var(--neon-pink)), 0 0 30px hsl(var(--neon-pink))",
          },
          "100%": {
            transform: "rotate(360deg)",
            boxShadow: "0 0 10px hsl(var(--neon-purple)), 0 0 20px hsl(var(--neon-purple))",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 5px hsl(var(--neon-purple)), 0 0 10px hsl(var(--neon-purple))",
          },
          "50%": {
            boxShadow: "0 0 15px hsl(var(--neon-pink)), 0 0 25px hsl(var(--neon-pink))",
          },
        },
        "pulse-opacity": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "text-glow": {
          "0%, 100%": {
            textShadow: "0 0 8px hsl(var(--neon-purple)), 0 0 12px hsl(var(--neon-purple))",
          },
          "50%": {
            textShadow: "0 0 16px hsl(var(--neon-pink)), 0 0 24px hsl(var(--neon-pink))",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-glow": "spin-glow 2s linear infinite",
        "pulse-glow": "pulse-glow 2s infinite",
        "pulse-opacity": "pulse-opacity 2s infinite",
        "text-glow": "text-glow 3s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
