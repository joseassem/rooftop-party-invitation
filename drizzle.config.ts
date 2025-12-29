import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// Load .env.local for local development
config({ path: '.env.local' })

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required. Add it to .env.local')
}

export default defineConfig({
    schema: './lib/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
})
