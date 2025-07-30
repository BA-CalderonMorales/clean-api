/**
 * Test fixtures and sample data for use across test suites.
 * Provides consistent, reusable test data that follows the Clean API patterns.
 */

import type { APIRequest, APIResponse, HTTPMethod } from '../../src/APITypes';

/**
 * Sample user data for testing API operations.
 */
export const sampleUser = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  createdAt: '2025-01-01T00:00:00Z',
};

/**
 * Sample product data for testing API operations.
 */
export const sampleProduct = {
  id: 101,
  name: 'Test Product',
  price: 99.99,
  category: 'Electronics',
  inStock: true,
};

/**
 * Sample API request fixtures for different HTTP methods.
 */
export const sampleRequests: Record<HTTPMethod, APIRequest> = {
  GET: {
    url: '/api/users/1',
    method: 'GET',
  },
  POST: {
    url: '/api/users',
    method: 'POST',
    data: sampleUser,
  },
  PUT: {
    url: '/api/users/1',
    method: 'PUT',
    data: { ...sampleUser, name: 'Jane Doe' },
  },
  PATCH: {
    url: '/api/users/1',
    method: 'PATCH',
    data: { name: 'Jane Doe' },
  },
  DELETE: {
    url: '/api/users/1',
    method: 'DELETE',
  },
};

/**
 * Sample API response fixtures for different scenarios.
 */
export const sampleResponses = {
  success: {
    data: sampleUser,
    status: 200,
  } as APIResponse<typeof sampleUser>,
  
  created: {
    data: sampleUser,
    status: 201,
  } as APIResponse<typeof sampleUser>,
  
  noContent: {
    data: null,
    status: 204,
  } as APIResponse<null>,
  
  notFound: {
    data: { error: 'User not found' },
    status: 404,
  } as APIResponse<{ error: string }>,
  
  serverError: {
    data: { error: 'Internal server error' },
    status: 500,
  } as APIResponse<{ error: string }>,
  
  validationError: {
    data: { 
      error: 'Validation failed',
      details: ['Name is required', 'Email must be valid']
    },
    status: 422,
  } as APIResponse<{ error: string; details: string[] }>,
};

/**
 * Sample route configurations for testing APIBase.
 */
export const sampleRoutes = {
  users: '/api/users',
  userById: '/api/users/:id',
  products: '/api/products',
  productById: '/api/products/:id',
  orders: '/api/orders',
};

/**
 * Sample configuration options for testing APIBase.
 */
export const sampleConfig = {
  baseURL: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * Sample error scenarios for comprehensive error testing.
 */
export const errorScenarios = {
  networkError: new Error('Network connection failed'),
  timeoutError: new Error('Request timeout'),
  parseError: new Error('JSON parse error'),
  authError: new Error('Authentication failed'),
};

/**
 * Helper to create mock fetch responses with proper structure.
 */
export const createMockResponse = (data: any, status: number = 200): Response => {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: async () => data,
    text: async () => JSON.stringify(data),
    headers: new Headers(),
  } as Response;
};
