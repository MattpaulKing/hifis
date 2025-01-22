import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { kitRoutes } from "vite-plugin-kit-routes"

export default defineConfig({
  plugins: [
    sveltekit(),
    kitRoutes({
      SERVERS: {
        'GET /api/v1/search': {
          explicit_search_params: {
            value: { type: 'string' }
          }
        }
      }
    })
  ],
}) 
