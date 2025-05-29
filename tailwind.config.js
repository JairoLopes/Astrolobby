/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/*/.{js,ts,jsx,tsx}"], // Garante que o Tailwind detecta seus arquivos
  theme: {
    extend: {},
  },
  plugins: [],
};
