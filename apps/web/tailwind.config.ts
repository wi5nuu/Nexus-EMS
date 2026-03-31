import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      fontFamily: {
        syne: ["var(--font-syne)", "sans-serif"],
        dmsans: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      colors: {
        // Base Palette (Void)
        void: {
          50: "var(--void-50)",
          100: "var(--void-100)",
          200: "var(--void-200)",
          500: "var(--void-500)",
          700: "var(--void-700)",
          800: "var(--void-800)",
          900: "var(--void-900)",
          950: "var(--void-950)",
        },
        violet: {
          300: "var(--violet-300)",
          400: "var(--violet-400)",
          500: "var(--violet-500)",
          600: "var(--violet-600)",
          700: "var(--violet-700)",
        },
        emerald: {
          400: "var(--emerald-400)",
          500: "var(--emerald-500)",
          600: "var(--emerald-600)",
        },
        crimson: {
          400: "var(--crimson-400)",
          500: "var(--crimson-500)",
          600: "var(--crimson-600)",
        },
        amber: {
          400: "var(--amber-400)",
          500: "var(--amber-500)",
          600: "var(--amber-600)",
        },
        sapphire: {
          400: "var(--sapphire-400)",
          500: "var(--sapphire-500)",
          600: "var(--sapphire-600)",
        },
        teal: {
          400: "var(--teal-400)",
          500: "var(--teal-500)",
          600: "var(--teal-600)",
        },
        rose: {
          400: "var(--rose-400)",
          500: "var(--rose-500)",
          600: "var(--rose-600)",
        },

        // Semantic Tokens
        border: "var(--border-default)",
        "border-subtle": "var(--border-subtle)",
        "border-strong": "var(--border-strong)",
        
        input: "var(--bg-sunken)",
        ring: "var(--brand-default)",
        
        background: "var(--bg-page)",
        foreground: "var(--text-primary)",

        bg: {
          page: "var(--bg-page)",
          panel: "var(--bg-panel)",
          surface: "var(--bg-surface)",
          elevated: "var(--bg-elevated)",
          sunken: "var(--bg-sunken)",
        },

        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          inverse: "var(--text-inverse)",
          link: "var(--text-link)",
        },

        primary: {
          DEFAULT: "var(--violet-500)",
          foreground: "#ffffff",
        },
        brand: {
          DEFAULT: "var(--brand-default)",
          hover: "var(--brand-hover)",
          muted: "var(--brand-muted)",
          text: "var(--brand-text)",
        },

        // Shadcn compatibility mapping
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
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "16": "64px",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        brand: "var(--shadow-brand)",
      },
      transitionDuration: {
        instant: "var(--duration-instant)",
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        slow: "var(--duration-slow)",
        slower: "var(--duration-slower)",
      },
      transitionTimingFunction: {
        default: "var(--ease-default)",
        in: "var(--ease-in)",
        out: "var(--ease-out)",
        spring: "var(--ease-spring)",
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
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
