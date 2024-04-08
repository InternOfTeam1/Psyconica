import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        'custom': '1200px',
      },
      minWidth: {
        'custom': '360px',
      },
      screens: {
        'xs': '360px',
        's': '400px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1200px',
        '2xl': '1536px'
      },
      fontSize: {
        'custom': '22px',
        'base': ['16px', '20px'],
        'sm': ['12px', '16px'],
        'lg': ['17px', '24px'],
        'xl': ['20px', '32px'],
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        'balsamiq-sans': ['"Balsamiq Sans"', 'sans-serif'],
        'unbounded': ['Unbounded', 'sans-serif'],
      },
      textVariantCaps: {
        'small-caps': { 'font-variant': 'small-caps' },
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }: { addUtilities: any; theme: any }) {
      addUtilities({
        '.text-small-caps': { 'font-variant': 'small-caps' },
      });
    },
  ],
};

export default config;
