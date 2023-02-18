import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import dsv from '@rollup/plugin-dsv';

// https://astro.build/config
export default defineConfig({
  site: 'https://scriptin.github.io',
  base: '/kanji-frequency',
  integrations: [tailwind(), mdx()],
  vite: {
    plugins: [dsv()],
  },
});
