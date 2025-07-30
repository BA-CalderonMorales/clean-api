/**
 * Test helper utilities for Clean API testing.
 * Provides common functionality and assertions for testing API components.
 */

import { expect } from 'vitest';
import type { APIResponse, APIResult, HTTPMethod } from '../../src/APITypes';
import { APIError } from '../../src/APIError';

/**
 * Assert that a value is defined (not null or undefined).
 * @param value - The value to check
 * @param message - Optional error message
 */
export function assertDefined<T>(value: T | null | undefined, message?: string): asserts value is T {
  expect(value, message || 'Expected value to be defined').toBeDefined();
  expect(value, message || 'Expected value to not be null').not.toBeNull();
}

/**
 * Assert that an API response has the expected structure.
 * @param response - The API response to validate
 * @param expectedStatus - Expected HTTP status code
 * @param hasData - Whether the response should have data
 */
export function assertAPIResponse<T>(
  response: APIResponse<T>,
  expectedStatus: number,
  hasData: boolean = true
): void {
  expect(response).toBeDefined();
  expect(response.status).toBe(expectedStatus);
  
  if (hasData) {
    expect(response.data).toBeDefined();
  }
}

/**
 * Assert that an API result follows the expected { data?, error? } pattern.
 * @param result - The API result to validate
 * @param expectSuccess - Whether to expect success (data) or failure (error)
 */
export async function assertAPIResult<T>(
  result: APIResult<T>,
  expectSuccess: boolean = true
): Promise<{ data?: T; error?: Error }> {
  const resolved = await result;
  expect(resolved).toBeDefined();
  
  if (expectSuccess) {
    expect(resolved.data).toBeDefined();
    expect(resolved.error).toBeUndefined();
  } else {
    expect(resolved.error).toBeDefined();
    expect(resolved.data).toBeUndefined();
  }
  
  return resolved;
}

/**
 * Assert that an error is an APIError with expected properties.
 * @param error - The error to validate
 * @param expectedMessage - Expected error message (optional)
 * @param expectedStatus - Expected status code (optional)
 */
export function assertAPIError(
  error: unknown,
  expectedMessage?: string,
  expectedStatus?: number
): asserts error is APIError {
  expect(error).toBeInstanceOf(APIError);
  
  const apiError = error as APIError;
  
  if (expectedMessage) {
    expect(apiError.message).toBe(expectedMessage);
  }
  
  if (expectedStatus) {
    expect(apiError.status).toBe(expectedStatus);
  }
}

/**
 * Create a promise that resolves after a specified delay.
 * Useful for testing timing-dependent behavior.
 * @param ms - Delay in milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a spy function that tracks calls and can return configured values.
 * @param returnValue - The value to return when called
 */
export function createSpy<T extends (...args: any[]) => any>(
  returnValue?: ReturnType<T>
): T & { calls: Parameters<T>[] } {
  const spy = ((...args: Parameters<T>) => {
    spy.calls.push(args);
    return returnValue;
  }) as T & { calls: Parameters<T>[] };
  
  spy.calls = [];
  return spy;
}

/**
 * Validate that an object implements the expected interface structure.
 * @param obj - The object to validate
 * @param expectedMethods - Array of method names that should exist
 * @param expectedProperties - Array of property names that should exist
 */
export function assertImplementsInterface(
  obj: any,
  expectedMethods: string[] = [],
  expectedProperties: string[] = []
): void {
  expect(obj).toBeDefined();
  expect(typeof obj).toBe('object');
  
  // Check methods exist and are functions
  for (const method of expectedMethods) {
    expect(obj[method], `Expected method '${method}' to exist`).toBeDefined();
    expect(typeof obj[method], `Expected '${method}' to be a function`).toBe('function');
  }
  
  // Check properties exist
  for (const property of expectedProperties) {
    expect(obj[property], `Expected property '${property}' to exist`).toBeDefined();
  }
}

/**
 * Test utility for validating HTTP method types.
 * @param method - The method to validate
 */
export function assertValidHTTPMethod(method: string): asserts method is HTTPMethod {
  const validMethods: HTTPMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  expect(validMethods).toContain(method);
}

/**
 * Helper to create test contexts for different scenarios.
 */
export class TestContext {
  private cleanupFunctions: (() => void)[] = [];

  /**
   * Add a cleanup function to be called when the test context is destroyed.
   * @param fn - The cleanup function
   */
  addCleanup(fn: () => void): void {
    this.cleanupFunctions.push(fn);
  }

  /**
   * Clean up all registered cleanup functions.
   */
  cleanup(): void {
    for (const fn of this.cleanupFunctions) {
      try {
        fn();
      } catch (error) {
        console.warn('Cleanup function failed:', error);
      }
    }
    this.cleanupFunctions.length = 0;
  }
}

/**
 * Utility to mock global fetch for testing.
 * @param mockImplementation - The mock fetch implementation
 */
export function mockGlobalFetch(mockImplementation: typeof fetch): () => void {
  const originalFetch = global.fetch;
  global.fetch = mockImplementation;
  
  return () => {
    global.fetch = originalFetch;
  };
}
