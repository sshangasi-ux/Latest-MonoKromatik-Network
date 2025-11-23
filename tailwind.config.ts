import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))", // Brand Red #C1272D
          foreground: "hsl(var(--primary-foreground))", // Pure White
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // Dark Grey #1F1F1F
          foreground: "hsl(var(--secondary-foreground))", // Pure White
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))", // Brand Red
          foreground: "hsl(var(--destructive-foreground))", // Pure White
        },
        muted: {
          DEFAULT: "hsl(var(--muted))", // Darker Grey
          foreground: "hsl(var(--muted-foreground))", // Gray-400
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // Brand Red
          foreground: "hsl(var(--accent-foreground))", // Pure White
        },
        popover: {
          DEFAULT: "hsl(var(--popover))", // Dark Grey
          foreground: "hsl(var(--popover-foreground))", // Pure White
        },
        card: {
          DEFAULT: "hsl(var(--card))", // Dark Grey #1F1F1F
          foreground: "hsl(var(--card-foreground))", // Pure White
        },
        sidebar: { // Adjusting sidebar colors to fit the new dark theme
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "0.5rem", // 8px
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "ticker 30s linear infinite", // Using 'marquee' for the ticker tape
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;