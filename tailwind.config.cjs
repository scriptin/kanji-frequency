/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
	},
	plugins: [
    function ({ addBase, theme }) {
      addBase({
        'a': {
          textDecoration: 'underline',
          textDecorationColor: theme('textColor.sky[500]'),
          textUnderlineOffset: theme('textUnderlineOffset.2'),
        },
        'a:hover': {
          textDecoration: 'underline',
          textDecorationColor: theme('textColor.sky[900]'),
        },

        'a.link-inverted': {
          textDecoration: 'underline',
          textDecorationColor: theme('textColor.sky[300]'),
          textUnderlineOffset: theme('textUnderlineOffset.2'),
        },
        'a.link-inverted:hover': {
          textDecoration: 'underline',
          textDecorationColor: theme('textColor.sky[100]'),
        },

        'a.link-plain': {
          textDecoration: 'inherit',
        },
      });
    },
  ],
};
