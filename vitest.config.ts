import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Test configuration
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'test/',
        '**/*.test.ts',
        '**/*.spec.ts',
        'coverage/',
        'dist/',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },

    // Include and exclude patterns
    include: ['test/**/*.{test,spec}.ts'],
    exclude: ['node_modules/', 'dist/'],

    // Test timeout
    testTimeout: 10000,
  },
});
