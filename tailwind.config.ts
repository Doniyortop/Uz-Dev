import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#10B981", // Emerald 500
          dark: "#059669",
          light: "#34D399",
        },
        dark: {
          900: "#0F172A", // Основной фон (Slate 900)
          800: "#1E293B", // Карточки/Секции
          700: "#334155",
        },
      },
    },
  },
  plugins: [],
};
export default config;
