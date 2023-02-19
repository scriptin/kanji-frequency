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
        html: {
          scrollBehavior: 'smooth',
        },
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
          // Headings must match those in src/components/Heading.astro
          'h2, h3': {
            fontWeight: theme('fontWeight.black'),
            marginBottom: theme('margin[1]'),
            '&:first-child': {
              marginTop: 0,
            },
          },
          h2: {
            fontSize: theme('fontSize.2xl'),
            lineHeight: theme('fontSize.2xl.[1].lineHeight'),
            marginTop: theme('margin[8]'),
          },
          h3: {
            fontSize: theme('fontSize.xl'),
            lineHeight: theme('fontSize.xl[1].lineHeight'),
            marginTop: theme('margin[4]'),
          },
          'p, blockquote, ul, ol': {
            marginBottom: theme('margin[4]'),
            '&:last-child': {
              marginBottom: 0,
            },
          },
          ul: {
            listStyleType: 'disc',
          },
          ol: {
            listStyleType: 'decimal',
          },
          'ul, ol': {
            listStylePosition: 'outside',
            li: {
              marginLeft: theme('margin[8]'),
            },
          },
          blockquote: {
            fontStyle: 'italic',
            borderLeft: `${theme('borderWidth[4]')} solid ${theme(
              'borderColor.sky[200]',
            )}`,
            paddingTop: theme('padding[1]'),
            paddingBottom: theme('padding[1]'),
            paddingLeft: theme('padding[4]'),
          },
        },
        '.box-inverted': {
          blockquote: {
            borderLeftColor: theme('borderColor.sky[800]'),
          },
        },
        [`@media (min-width: ${theme('screens.md')})`]: {
          // Headings must match those in src/components/Heading.astro
          '.markdown': {
            h2: {
              fontSize: theme('fontSize.3xl'),
            },
            h3: {
              fontSize: theme('fontSize.2xl'),
            },
          },
        },
      });
    },
  ],
};
