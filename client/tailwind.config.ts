import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        inputBg: "#F4F4F4",
        secondary: "var(--secondary)",
        lightText: "var(--lightText)",
        darkText: "var(--darkText)",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
      },
    },
  },

  plugins: [],
} satisfies Config;
