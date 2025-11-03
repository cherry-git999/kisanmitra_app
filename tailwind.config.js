const animate = require("tailwindcss-animate");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EEF7E8",
          100: "#DDEFD1",
          200: "#BBDEA3",
          300: "#98CE75",
          400: "#76BD47",
          500: "#54AD19",
          600: "#438A14",
          700: "#32670F",
          800: "#22450A",
          900: "#112205",
        },
        secondary: {
          50: "#F7F4EC",
          500: "#6D6C63",
        },
      },
    },
  },
  plugins: [animate],
};
