/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", ...defaultTheme.fontFamily.sans], // Add Syne as a custom font utility
      },
      keyframes: {
        'theme-switch': {
          '0%, 100%': { transform: 'translateY(-10px) rotateX(15deg) rotateY(-20deg)' },
          '50%': { transform: 'translateY(0px) rotateX(15deg) rotateY(-20deg)' },
        }
      },
      animation: {
        'theme-switch': 'theme-switch 3s infinite'
      },
      backgroundImage: {
        'switch-radial': `
          radial-gradient(at 21% 46%, hsla(183,65%,60%,1) 0px, transparent 50%),
          radial-gradient(at 23% 25%, hsla(359,74%,70%,1) 0px, transparent 50%),
          radial-gradient(at 20% 1%, hsla(267,83%,75%,1) 0px, transparent 50%),
          radial-gradient(at 86% 87%, hsla(204,69%,68%,1) 0px, transparent 50%),
          radial-gradient(at 99% 41%, hsla(171,72%,77%,1) 0px, transparent 50%),
          radial-gradient(at 55% 24%, hsla(138,60%,62%,1) 0px, transparent 50%)
        `,
        'slider-radial': `
          radial-gradient(at 81% 39%, hsla(327,79%,79%,1) 0px, transparent 50%),
          radial-gradient(at 11% 72%, hsla(264,64%,79%,1) 0px, transparent 50%),
          radial-gradient(at 23% 20%, hsla(75,98%,71%,1) 0px, transparent 50%);
        `,
      },
      boxShadow: {
        'slider-inset': `
          rgba(0,0,0,0.17) 0px -10px 10px 0px inset,
          rgba(0,0,0,0.09) 0px -1px 15px -8px
        `,
      },
    },
  },
  variants: {
    extend: {
      translate: ["before", "peer-checked"],
      opacity: ["peer-checked"],
      backgroundImage: ["peer-checked"],
    },
  },
  plugins: [require("@xpd/tailwind-3dtransforms")],
};
