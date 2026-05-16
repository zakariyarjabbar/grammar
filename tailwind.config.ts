import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#FCFCFC",
        secondary: "#F6F8FA",
        card: "#FFFFFF",
        ink: "#111111",
        muted: "#6B7280",
        line: "#E5E7EB",
        primary: "#104361",
        primaryHover: "#0B3249",
        success: "#16A34A",
        warning: "#F59E0B",
        error: "#DC2626"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(16, 67, 97, 0.08)",
        glow: "0 24px 80px rgba(16, 67, 97, 0.14)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "bar-fill": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" }
        },
        "soft-shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "30%": { transform: "translateX(-3px)" },
          "60%": { transform: "translateX(3px)" }
        }
      },
      animation: {
        "fade-up": "fade-up 520ms ease both",
        float: "float 6s ease-in-out infinite",
        "soft-shake": "soft-shake 220ms ease-in-out both"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
