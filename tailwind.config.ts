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
        jdr: {
          navy: "#0F1F3D",
          "navy-light": "#1A3260",
          gold: "#C9A84C",
          "gold-light": "#E5C97A",
          "gold-dark": "#A8832A",
          charcoal: "#2D3748",
          cream: "#F8F5EF",
          "cream-dark": "#EDE8DF",
          slate: "#64748B",
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
          info: "#3B82F6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "jdr-sm": "0 1px 3px rgba(15,31,61,0.08), 0 1px 2px rgba(15,31,61,0.06)",
        "jdr-md": "0 4px 6px rgba(15,31,61,0.07), 0 2px 4px rgba(15,31,61,0.06)",
        "jdr-lg": "0 10px 15px rgba(15,31,61,0.1), 0 4px 6px rgba(15,31,61,0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
