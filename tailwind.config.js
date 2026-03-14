/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
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
          50: '#f0fdff',
          100: '#e0faff',
          200: '#bdf2ff',
          300: '#82eaff',
          400: '#3de0ff',
          500: '#00e5ff',
          600: '#00b8cc',
          700: '#008e9e',
          800: '#00707a',
          900: '#005d66',
        },
        indigo: {
          50: '#f0fdff',
          500: '#00e5ff',
          600: '#00b8cc',
          DEFAULT: '#00e5ff',
        },
        blue: {
          50: '#f0fdff',
          500: '#00e5ff',
          600: '#00b8cc',
          DEFAULT: '#00e5ff',
        },
        cyan: {
          50: '#f0fdff',
          500: '#00e5ff',
          600: '#00b8cc',
          DEFAULT: '#00e5ff',
        },
        yellow: {
          400: '#FF854D',
          500: '#FF854D',
          600: '#e66d3a',
          DEFAULT: '#FF854D',
        },
        orange: {
          400: '#FF854D',
          500: '#FF854D',
          600: '#e66d3a',
          DEFAULT: '#FF854D',
        },
        amber: {
          400: '#FF854D',
          500: '#FF854D',
          600: '#e66d3a',
          DEFAULT: '#FF854D',
        },
        carbon: {
          DEFAULT: '#37383F',
          dark: '#2d2d2d',
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
} 