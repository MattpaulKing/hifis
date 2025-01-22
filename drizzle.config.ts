import { defineConfig } from 'drizzle-kit';
import { config } from "dotenv"

config({ path: ".env" })

export default defineConfig({
  schema: './src/schemas/index.ts',
  out: "./migrations",
  verbose: true,
  strict: true,
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URI!
  },
});
