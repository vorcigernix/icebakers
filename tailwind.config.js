const defaultTheme = require("tailwindcss/defaultTheme"); 
module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Lato", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {
      borderRadius: ["first"],
      borderRadius: ["last"],
    },
  },
  plugins: [],
};
