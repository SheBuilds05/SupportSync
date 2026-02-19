/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-navy': '#1B314C',
        'brand-blue': '#82AFE5',
      },
      backgroundImage: {
        'mesh': "radial-gradient(at 0% 0%, #82AFE5 0px, transparent 50%), radial-gradient(at 100% 100%, #1B314C 0px, transparent 50%), radial-gradient(at 100% 0%, #82AFE5 0px, transparent 50%), radial-gradient(at 0% 100%, #1B314C 0px, transparent 50%)",
      }
    },
  },
  plugins: [],
}