
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#020202",   // contornos e textos
        sky: "#262727",   // fundo da página
        pow: "#bb4d4d",   // amarelo de destaque
        hot: "#FF4D4D",
        blue: "#f5be08",
        mint: "#2EC4A6",
        violet: "#f5be08",
      },
      fontFamily: {
        display: ["Bangers", "Impact", "sans-serif"],
        sans: ["Figtree", "system-ui", "sans-serif"],
      },
      boxShadow: {
        panel: "5px 5px 0 #17143A",
        press: "2px 2px 0 #17143A",
      },
    },
  },
};
