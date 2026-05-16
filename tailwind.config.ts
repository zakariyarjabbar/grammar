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
        body: "#374151",
        muted: "#6B7280",
        line: "#E5E7EB",
        lineStrong: "#D1D5DB",
        primary: "#104361",
        primaryHover: "#0B324A",
        primarySoft: "#EAF2F6",
        primaryVerySoft: "#F3F8FA",
        success: "#16A34A",
        successSoft: "#ECFDF3",
        warning: "#F59E0B",
        warningSoft: "#FFFBEB",
        error: "#DC2626",
        errorSoft: "#FEF2F2"
      },
      boxShadow: {
        soft: "0 12px 28px rgba(17, 24, 39, 0.06)",
        glow: "0 20px 54px rgba(16, 67, 97, 0.12)",
        lift: "0 16px 38px rgba(17, 24, 39, 0.08)"
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
