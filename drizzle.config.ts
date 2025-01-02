import { defineConfig } from 'drizzle-kit';
import { config } from "dotenv"

config({ path: ".env" })

export default defineConfig({
  schema: './src/schemas/index.ts',
  out: "./migrations",

  dbCredentials: {
    url: process.env.DB_URI!
  },

  verbose: true,
  strict: true,
  dialect: 'postgresql'
});
