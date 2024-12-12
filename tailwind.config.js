/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lite: '#BD76F6',
        litegreen: '#14C71A',
      },
      clipPath: {
        'custom-polygon': 'polygon(30% 0%, 100% 0, 100% 30%, 100% 100%, 70% 100%, 30% 100%, 0 100%, 0 0)',
      },
      fontFamily: {
        'astron_boy': ['astron_boy', 'sans-serif'],
        'bankgothic': ['bankgothic', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function({ addUtilities }) {
      addUtilities({
        '.clip-path-custom-polygon': {
          clipPath: 'polygon(30% 0%, 100% 0, 100% 30%, 100% 100%, 70% 100%, 30% 100%, 0 100%, 0 0)',
        },
      });
    },
  ],
};
