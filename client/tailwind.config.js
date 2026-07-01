/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // "node_modules/flowbite-react/lib/esm/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 4s linear infinite",
      },
    },
  },
  plugins: [],
};
