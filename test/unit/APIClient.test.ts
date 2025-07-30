/**
 * Unit tests for APIClient interface and FetchClient implementation.
 * Tests HTTP client abstraction layer, fetch implementation, and error handling.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { APIClient, FetchClient } from '../../src/APIClient';
import { mockFetch } from '../__mocks__/fetch';
import { 
  sampleUser, 
  sampleRequests, 
  createMockResponse 
} from '../__mocks__/fixtures';
import { 
  assertImplementsInterface, 
  mockGlobalFetch,
  TestContext 
} from '../utils/testHelpers';

describe('APIClient', () => {
  describe('APIClient interface', () => {
    it('should define the correct interface structure', () => {
      // Create a mock implementation to test interface
      const mockClient: APIClient = {
        request: vi.fn(),
      };

      assertImplementsInterface(mockClient, ['request']);
    });

    it('should accept generic type parameters', () => {
      interface User {
        id: number;
        name: string;
      }

      const mockClient: APIClient = {
        request: async <T = any>() => ({} as T),
      };

      // TypeScript compilation test - should not throw errors
      const userPromise: Promise<User> = mockClient.request<User>({
        url: '/api/users/1',
        method: 'GET',
      });

      expect(userPromise).toBeInstanceOf(Promise);
    });
  });

  describe('FetchClient', () => {
    let client: FetchClient;
    let testContext: TestContext;
    let restoreFetch: () => void;

    beforeEach(() => {
      client = new FetchClient();
      testContext = new TestContext();
      mockFetch.reset();
      
      // Mock global fetch
      restoreFetch = mockGlobalFetch(mockFetch.fetch);
      testContext.addCleanup(restoreFetch);
    });

    afterEach(() => {
      testContext.cleanup();
    });

    describe('Constructor', () => {
      it('should create instance with correct interface', () => {
        expect(client).toBeInstanceOf(FetchClient);
        assertImplementsInterface(client, ['request']);
      });

      it('should implement APIClient interface', () => {
        const apiClient: APIClient = client;
        expect(apiClient).toBeDefined();
        expect(typeof apiClient.request).toBe('function');
      });
    });

    describe('GET requests', () => {
      it('should make successful GET request', async () => {
        const expectedData = sampleUser;
        mockFetch.mockSuccess('/api/users/1', 'GET', expectedData);

        const result = await client.request({
          url: '/api/users/1',
          method: 'GET',
        });

        expect(result).toEqual(expectedData);
        
        const requests = mockFetch.getRequests();
        expect(requests).toHaveLength(1);
        expect(requests[0].url).toBe('/api/users/1');
        expect(requests[0].method).toBe('GET');
      });

      it('should make GET request without data parameter', async () => {
        mockFetch.mockSuccess('/api/users', 'GET', [sampleUser]);

        const result = await client.request({
          url: '/api/users',
          method: 'GET',
        });

        const lastRequest = mockFetch.getLastRequest();
        expect(lastRequest?.body).toBeUndefined();
        expect(result).toEqual([sampleUser]);
      });

      it('should handle GET request with query parameters in URL', async () => {
        const url = '/api/users?page=1&limit=10';
        mockFetch.mockSuccess(url, 'GET', { users: [sampleUser], total: 1 });

        const result = await client.request({
          url,
          method: 'GET',
        });

        expect(result.users).toEqual([sampleUser]);
        expect(result.total).toBe(1);
      });
    });

    describe('POST requests', () => {
      it('should make successful POST request with data', async () => {
        const requestData = { name: 'New User', email: 'new@example.com' };
        const responseData = { ...requestData, id: 2 };
        
        mockFetch.mockSuccess('/api/users', 'POST', responseData);

        const result = await client.request({
          url: '/api/users',
          method: 'POST',
          data: requestData,
        });

        expect(result).toEqual(responseData);
        
        const lastRequest = mockFetch.getLastRequest();
        expect(lastRequest?.method).toBe('POST');
        expect(lastRequest?.body).toBe(JSON.stringify(requestData));
      });

      it('should set correct Content-Type header', async () => {
        mockFetch.mockSuccess('/api/test', 'POST', {});

        await client.request({
          url: '/api/test',
          method: 'POST',
          data: { test: true },
        });

        const lastRequest = mockFetch.getLastRequest();
        expect(lastRequest?.headers?.['Content-Type']).toBe('application/json');
      });

      it('should handle POST without data', async () => {
        mockFetch.mockSuccess('/api/action', 'POST', { success: true });

        const result = await client.request({
          url: '/api/action',
          method: 'POST',
        });

        expect(result).toEqual({ success: true });
        
        const lastRequest = mockFetch.getLastRequest();
        expect(lastRequest?.body).toBeUndefined();
      });
    });

    describe('PUT requests', () => {
      it('should make successful PUT request', async () => {
        const updateData = { name: 'Updated User' };
        const responseData = { ...sampleUser, ...updateData };
        
        mockFetch.mockSuccess('/api/users/1', 'PUT', responseData);

        const result = await client.request({
          url: '/api/users/1',
          method: 'PUT',
          data: updateData,
        });

        expect(result).toEqual(responseData);
        
        const lastRequest = mockFetch.getLastRequest();
        expect(lastRequest?.method).toBe('PUT');
        expect(lastRequest?.body).toBe(JSON.stringify(updateData));
      });
    });

    describe('PATCH requests', () => {
      it('should make successful PATCH request', async () => {
        const patchData = { email: 'patched@example.com' };
        const responseData = { ...sampleUser, ...patchData };
        
        mockFetch.mockSuccess('/api/users/1', 'PATCH', responseData);

        const result = await client.request({
          url: '/api/users/1',
          method: 'PATCH',
          data: patchData,
        });

        expect(result).toEqual(responseData);
        
        const lastRequest = mockFetch.getLastRequest();
        expect(lastRequest?.method).toBe('PATCH');
        expect(lastRequest?.body).toBe(JSON.stringify(patchData));
      });
    });

    describe('DELETE requests', () => {
      it('should make successful DELETE request', async () => {
        mockFetch.mockSuccess('/api/users/1', 'DELETE', null);

        const result = await client.request({
          url: '/api/users/1',
          method: 'DELETE',
        });

        expect(result).toBeNull();
        
        const lastRequest = mockFetch.getLastRequest();
        expect(lastRequest?.method).toBe('DELETE');
        expect(lastRequest?.body).toBeUndefined();
      });

      it('should handle DELETE with confirmation data', async () => {
        const confirmationData = { confirm: true, reason: 'User request' };
        mockFetch.mockSuccess('/api/users/1', 'DELETE', { deleted: true });

        const result = await client.request({
          url: '/api/users/1',
          method: 'DELETE',
          data: confirmationData,
        });

        expect(result).toEqual({ deleted: true });
        
        const lastRequest = mockFetch.getLastRequest();
        expect(lastRequest?.body).toBe(JSON.stringify(confirmationData));
      });
    });

    describe('Error handling', () => {
      it('should handle network errors', async () => {
        // Mock fetch to throw network error
        const networkError = new Error('Network connection failed');
        restoreFetch();
        restoreFetch = mockGlobalFetch(vi.fn().mockRejectedValue(networkError));

        await expect(
          client.request({
            url: '/api/users',
            method: 'GET',
          })
        ).rejects.toThrow('Network connection failed');
      });

      it('should handle HTTP error responses', async () => {
        mockFetch.mockError('/api/users/999', 'GET', 404, { error: 'User not found' });

        // Note: FetchClient doesn't throw on HTTP errors by default,
        // it returns the response. Error handling is typically done at a higher level.
        const result = await client.request({
          url: '/api/users/999',
          method: 'GET',
        });

        expect(result).toEqual({ error: 'User not found' });
      });

      it('should handle JSON parse errors', async () => {
        // Mock fetch to return invalid JSON
        restoreFetch();
        restoreFetch = mockGlobalFetch(vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
        }));

        await expect(
          client.request({
            url: '/api/invalid-json',
            method: 'GET',
          })
        ).rejects.toThrow('Invalid JSON');
      });
    });

    describe('Data serialization', () => {
      it('should serialize complex objects', async () => {
        const complexData = {
          user: sampleUser,
          metadata: {
            timestamp: '2025-01-01T00:00:00Z',
            source: 'test',
            nested: {
              deep: {
                value: true,
              },
            },
          },
          tags: ['test', 'complex', 'data'],
        };

        mockFetch.mockSuccess('/api/complex', 'POST', { received: true });

        await client.request({
          url: '/api/complex',
          method: 'POST',
          data: complexData,
        });

        const lastRequest = mockFetch.getLastRequest();
        const sentData = JSON.parse(lastRequest?.body || '{}');
        expect(sentData).toEqual(complexData);
      });

      it('should handle special data types', async () => {
        const specialData = {
          date: new Date('2025-01-01'),
          regex: /test/g,
          func: () => 'test',
          undef: undefined,
          nullValue: null,
        };

        mockFetch.mockSuccess('/api/special', 'POST', {});

        await client.request({
          url: '/api/special',
          method: 'POST',
          data: specialData,
        });

        const lastRequest = mockFetch.getLastRequest();
        const sentData = JSON.parse(lastRequest?.body || '{}');
        
        // JSON.stringify behavior for special types
        expect(sentData.date).toBe('2025-01-01T00:00:00.000Z');
        expect(sentData.regex).toEqual({});
        expect(sentData.func).toBeUndefined();
        expect(sentData.undef).toBeUndefined();
        expect(sentData.nullValue).toBeNull();
      });
    });

    describe('Generic type support', () => {
      interface User {
        id: number;
        name: string;
        email: string;
      }

      interface CreateUserRequest {
        name: string;
        email: string;
      }

      it('should support typed requests and responses', async () => {
        const requestData: CreateUserRequest = {
          name: 'Typed User',
          email: 'typed@example.com',
        };

        const responseData: User = {
          id: 10,
          name: 'Typed User',
          email: 'typed@example.com',
        };

        mockFetch.mockSuccess('/api/users', 'POST', responseData);

        const result: User = await client.request<User>({
          url: '/api/users',
          method: 'POST',
          data: requestData,
        });

        expect(result.id).toBe(10);
        expect(result.name).toBe('Typed User');
        expect(result.email).toBe('typed@example.com');
      });
    });

    describe('Integration patterns', () => {
      it('should work with all standard HTTP methods', async () => {
        const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;
        
        for (const method of methods) {
          const url = `/api/test-${method.toLowerCase()}`;
          mockFetch.mockSuccess(url, method, { method });

          const result = await client.request({
            url,
            method,
            data: method !== 'GET' && method !== 'DELETE' ? { test: true } : undefined,
          });

          expect(result).toEqual({ method });
        }

        expect(mockFetch.getRequests()).toHaveLength(methods.length);
      });

      it('should maintain request order in rapid succession', async () => {
        const requests = [
          { url: '/api/request-1', method: 'GET' as const },
          { url: '/api/request-2', method: 'GET' as const },
          { url: '/api/request-3', method: 'GET' as const },
        ];

        requests.forEach((req, index) => {
          mockFetch.mockSuccess(req.url, req.method, { order: index });
        });

        const promises = requests.map(req => client.request(req));
        const results = await Promise.all(promises);

        results.forEach((result, index) => {
          expect(result.order).toBe(index);
        });
      });
    });
  });
});
