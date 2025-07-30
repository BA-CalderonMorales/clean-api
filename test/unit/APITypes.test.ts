/**
 * Unit tests for APITypes module.
 * Tests type definitions, interfaces, and type guards for the Clean API library.
 */

import { describe, it, expect } from 'vitest';
import type { HTTPMethod, APIRequest, APIResponse, APIResult } from '../../src/APITypes';
import { assertValidHTTPMethod, assertAPIResponse } from '../utils/testHelpers';
import '../utils/assertions';

describe('APITypes', () => {
  describe('HTTPMethod type', () => {
    it('should accept valid HTTP methods', () => {
      const validMethods: HTTPMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      
      validMethods.forEach(method => {
        expect(method).toBeValidHTTPMethod();
        assertValidHTTPMethod(method);
      });
    });

    it('should have exactly 5 supported methods', () => {
      const methods: HTTPMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      expect(methods).toHaveLength(5);
    });
  });

  describe('APIRequest interface', () => {
    it('should have required properties', () => {
      const request: APIRequest = {
        url: '/api/test',
        method: 'GET',
      };

      expect(request).toHaveProperty('url');
      expect(request).toHaveProperty('method');
      expect(request.url).toBeTypeOf('string');
      expect(request.method).toBeValidHTTPMethod();
    });

    it('should accept optional data property', () => {
      const requestWithData: APIRequest = {
        url: '/api/test',
        method: 'POST',
        data: { name: 'test' },
      };

      expect(requestWithData).toHaveProperty('data');
      expect(requestWithData.data).toEqual({ name: 'test' });
    });

    it('should work without data property', () => {
      const requestWithoutData: APIRequest = {
        url: '/api/test',
        method: 'GET',
      };

      expect(requestWithoutData.data).toBeUndefined();
    });

    it('should accept various data types', () => {
      const requests: APIRequest[] = [
        {
          url: '/api/test',
          method: 'POST',
          data: 'string data',
        },
        {
          url: '/api/test',
          method: 'POST',
          data: 123,
        },
        {
          url: '/api/test',
          method: 'POST',
          data: { complex: { nested: { object: true } } },
        },
        {
          url: '/api/test',
          method: 'POST',
          data: [1, 2, 3],
        },
      ];

      requests.forEach(request => {
        expect(request).toHaveProperty('url');
        expect(request).toHaveProperty('method');
        expect(request).toHaveProperty('data');
      });
    });
  });

  describe('APIResponse interface', () => {
    it('should have required properties with correct types', () => {
      const response: APIResponse = {
        data: { id: 1, name: 'test' },
        status: 200,
      };

      expect(response).toBeValidAPIResponse();
      assertAPIResponse(response, 200, true);
    });

    it('should work with generic types', () => {
      interface User {
        id: number;
        name: string;
        email: string;
      }

      const userResponse: APIResponse<User> = {
        data: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
        },
        status: 200,
      };

      expect(userResponse).toBeValidAPIResponse();
      expect(userResponse.data).toHaveProperty('id');
      expect(userResponse.data).toHaveProperty('name');
      expect(userResponse.data).toHaveProperty('email');
      expect(userResponse.data.id).toBeTypeOf('number');
      expect(userResponse.data.name).toBeTypeOf('string');
      expect(userResponse.data.email).toBeTypeOf('string');
    });

    it('should accept various status codes', () => {
      const statusCodes = [200, 201, 204, 400, 401, 403, 404, 422, 500];
      
      statusCodes.forEach(status => {
        const response: APIResponse = {
          data: {},
          status,
        };
        
        expect(response).toBeValidAPIResponse();
        expect(response.status).toBe(status);
      });
    });

    it('should work with null/undefined data', () => {
      const responses: APIResponse[] = [
        { data: null, status: 204 },
        { data: undefined, status: 204 },
      ];

      responses.forEach(response => {
        expect(response).toBeValidAPIResponse();
        expect(response.status).toBe(204);
      });
    });
  });

  describe('APIResult type', () => {
    it('should represent a promise that resolves to result object', async () => {
      const successResult: APIResult<{ id: number }> = Promise.resolve({
        data: { id: 1 },
      });

      const result = await successResult;
      expect(result).toBeValidAPIResult();
      expect(result.data).toEqual({ id: 1 });
      expect(result.error).toBeUndefined();
    });

    it('should handle error results', async () => {
      const errorResult: APIResult<any> = Promise.resolve({
        error: new Error('Something went wrong'),
      });

      const result = await errorResult;
      expect(result).toBeValidAPIResult();
      expect(result.data).toBeUndefined();
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe('Something went wrong');
    });

    it('should work with generic types', async () => {
      interface Product {
        id: number;
        name: string;
        price: number;
      }

      const productResult: APIResult<Product> = Promise.resolve({
        data: {
          id: 101,
          name: 'Test Product',
          price: 99.99,
        },
      });

      const result = await productResult;
      expect(result).toBeValidAPIResult();
      expect(result.data).toHaveProperty('id');
      expect(result.data).toHaveProperty('name');
      expect(result.data).toHaveProperty('price');
      expect(result.data?.price).toBeTypeOf('number');
    });

    it('should not have both data and error simultaneously', async () => {
      // This test ensures the type system prevents invalid states
      const validResults = [
        { data: { test: true } },
        { error: new Error('Test error') },
        { data: { test: true }, error: undefined },
        { data: undefined, error: new Error('Test error') },
      ];

      for (const result of validResults) {
        expect(result).toBeValidAPIResult();
        expect(!(result.data && result.error)).toBe(true);
      }
    });
  });

  describe('Type compatibility and usage patterns', () => {
    it('should allow APIRequest to be used with all HTTP methods', () => {
      const methods: HTTPMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      
      methods.forEach(method => {
        const request: APIRequest = {
          url: `/api/${method.toLowerCase()}`,
          method,
          data: method !== 'GET' && method !== 'DELETE' ? { test: true } : undefined,
        };
        
        expect(request.method).toBeValidHTTPMethod();
        expect(request.url).toBeTypeOf('string');
      });
    });

    it('should support method chaining patterns', async () => {
      // Simulate a typical usage pattern
      const createRequest = (method: HTTPMethod, url: string, data?: any): APIRequest => ({
        url,
        method,
        data,
      });

      const processResponse = <T>(response: APIResponse<T>): APIResult<T> => {
        if (response.status >= 200 && response.status < 300) {
          return Promise.resolve({ data: response.data });
        } else {
          return Promise.resolve({ error: new Error(`HTTP ${response.status}`) });
        }
      };

      const request = createRequest('POST', '/api/users', { name: 'Test User' });
      const response: APIResponse<{ id: number; name: string }> = {
        data: { id: 1, name: 'Test User' },
        status: 201,
      };
      
      const result = await processResponse(response);
      
      expect(request).toHaveProperty('method', 'POST');
      expect(response).toBeValidAPIResponse();
      expect(result).toBeValidAPIResult();
    });
  });
});
