/**
 * Custom assertions for Clean API testing.
 * Extends Vitest's assertion capabilities with domain-specific matchers.
 */

import { expect } from 'vitest';

/**
 * Extended matcher interface for TypeScript support.
 */
interface CustomMatchers<R = unknown> {
  toBeValidAPIResponse(): R;
  toBeValidAPIResult(): R;
  toBeValidHTTPMethod(): R;
  toHaveValidAPIStructure(): R;
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

/**
 * Custom matcher to validate API response structure.
 */
expect.extend({
  toBeValidAPIResponse(received: any) {
    const pass = (
      received &&
      typeof received === 'object' &&
      'data' in received &&
      'status' in received &&
      typeof received.status === 'number' &&
      received.status >= 100 &&
      received.status < 600
    );

    return {
      message: () => 
        pass 
          ? `Expected ${received} not to be a valid API response`
          : `Expected ${received} to be a valid API response with data and status properties`,
      pass,
    };
  },
});

/**
 * Custom matcher to validate API result structure.
 */
expect.extend({
  toBeValidAPIResult(received: any) {
    const pass = (
      received &&
      typeof received === 'object' &&
      ('data' in received || 'error' in received) &&
      !(received.data && received.error) // Should not have both
    );

    return {
      message: () =>
        pass
          ? `Expected ${received} not to be a valid API result`
          : `Expected ${received} to be a valid API result with either data or error (but not both)`,
      pass,
    };
  },
});

/**
 * Custom matcher to validate HTTP method.
 */
expect.extend({
  toBeValidHTTPMethod(received: any) {
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    const pass = typeof received === 'string' && validMethods.includes(received);

    return {
      message: () =>
        pass
          ? `Expected ${received} not to be a valid HTTP method`
          : `Expected ${received} to be one of: ${validMethods.join(', ')}`,
      pass,
    };
  },
});

/**
 * Custom matcher to validate API component structure.
 */
expect.extend({
  toHaveValidAPIStructure(received: any) {
    const pass = (
      received &&
      typeof received === 'object' &&
      received.constructor &&
      received.constructor.name
    );

    return {
      message: () =>
        pass
          ? `Expected ${received} not to have valid API structure`
          : `Expected ${received} to be a valid API component with proper constructor`,
      pass,
    };
  },
});

export {};  // Make this a module
