/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        'bg-light': '#F5F5F5',
        'waiting': '#AFEEEE',
        'waiting-child': '#E8F8F8',
        'in-progress': '#FFE4B5',
        'in-progress-child': '#FFF5CC',
        'done': '#90EE90',
        'done-child': '#E5F4E5',
        'cancelled': '#FFC0CB',
        'cancelled-child': '#FFE0E0',
        'pending': '#E6E6FA',
        'pending-child': '#F2F2FA',
        'drag-child': '#98FB98',
      },
      minHeight: {
        20: '5rem',
        24: '6rem',
      },
      maxHeight: {
        104: '26rem',
        112: '28rem',
        120: '30rem',
        128: '32rem',
        136: '34rem',
        144: '36rem',
        152: '38rem',
        160: '40rem',
        168: '42rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-hide': {
          scrollbarWidth: 'none' /* Firefox */,
          '-ms-overflow-style': 'none' /* IE and Edge */,
          '&::-webkit-scrollbar': {
            display: 'none' /* Chrome, Safari and Edge */,
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
