import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node', // important for backend
    globals: true, // so you can use test/expect without import if you like
    include: ['src/routes/*.test.ts'],
    exclude: ['node_modules', 'dist'],
  },
})
