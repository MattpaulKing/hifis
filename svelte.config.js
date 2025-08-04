import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    experimental: {
      remoteFunctions: true
    },
    alias: {
      '$routes': './src/routes',
      '$api': './src/routes/api/v1',
      '$src': './src'
    },
    adapter: adapter()
  }
};

export default config;
