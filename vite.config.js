import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
    reporters: 'verbose',

    // isso resolve o conflito no database

    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
})
