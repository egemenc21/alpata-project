/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "primary": "#5D27A1",
        "secondary": "#DFDFDF",
        "tertiary":"#A9A9A9",
        "success":"#30CC71",
        "fail":"#E84C3C"
      },
    },
  },
  plugins: [],
}