/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    function ({ addBase, theme }) {
      addBase({
        // Basic links
        a: {
          textDecoration: 'underline',
          textDecorationColor: theme('textColor.sky[500]'),
          textUnderlineOffset: theme('textUnderlineOffset[2]'),
          '&:hover': {
            textDecoration: 'underline',
            textDecorationColor: theme('textColor.sky[900]'),
          },
        },
        // Inverted links
        'a.link-inverted, .box-inverted a': {
          textDecorationColor: theme('textColor.sky[300]'),
          '&:hover': {
            textDecorationColor: theme('textColor.sky[100]'),
          },
        },
        // Plain links - no underline or other decorations
        'a.link-plain': {
          textDecoration: 'inherit',
        },
        '.markdown': {
          'h2, h3': {
            fontWeight: theme('fontWeight.black'),
            marginBottom: theme('margin[1]'),
          },
          h2: {
            fontSize: theme('fontSize.2xl.'),
            lineHeight: theme('fontSize.2xl.[1].lineHeight'),
          },
          h3: {
            fontSize: theme('fontSize.xl'),
            lineHeight: theme('fontSize.xl[1].lineHeight'),
          },
          'p + h2, p + h3': {
            marginTop: theme('margin[4]'),
          },
          p: {
            marginBottom: theme('margin[4]'),
            '&:last-child': {
              marginBottom: 0,
            },
          },
        },
      });
    },
  ],
};
