/**
 * Test setup file for Clean API tests.
 * Configures global test environment, imports utilities, and sets up common mocks.
 */

import { vi, beforeEach, afterEach } from 'vitest';

// Import custom assertions to extend Vitest
import './utils/assertions';

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
  
  // Reset console mocks
  vi.restoreAllMocks();
});

// Global teardown
afterEach(() => {
  // Clean up any global state
  vi.clearAllTimers();
});

// Setup global environment
Object.defineProperty(window, 'fetch', {
  writable: true,
  value: vi.fn(),
});

// Mock console methods for cleaner test output
global.console = {
  ...console,
  // Uncomment to suppress console output during tests
  // log: vi.fn(),
  // debug: vi.fn(),
  // info: vi.fn(),
  // warn: vi.fn(),
  // error: vi.fn(),
};
