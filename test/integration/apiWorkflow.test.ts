/**
 * Integration tests for Clean API workflow.
 * Tests complete API interactions, component integration, and real-world usage patterns.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { API } from '../../src/API';
import { APIBase } from '../../src/APIBase';
import { FetchClient, APIClient } from '../../src/APIClient';
import { APIError } from '../../src/APIError';
import type { APIRequest, APIResponse, APIResult } from '../../src/APITypes';
import { mockFetch } from '../__mocks__/fetch';
import { 
  sampleUser, 
  sampleProduct, 
  sampleRoutes, 
  sampleConfig,
  sampleResponses 
} from '../__mocks__/fixtures';
import { 
  assertAPIResponse, 
  assertAPIResult, 
  assertAPIError,
  mockGlobalFetch, 
  TestContext 
} from '../utils/testHelpers';

describe('Clean API Integration', () => {
  let testContext: TestContext;
  let restoreFetch: () => void;

  beforeEach(() => {
    testContext = new TestContext();
    mockFetch.reset();
    restoreFetch = mockGlobalFetch(mockFetch.fetch);
    testContext.addCleanup(restoreFetch);
  });

  afterEach(() => {
    testContext.cleanup();
  });

  describe('Complete API workflow', () => {
    it('should handle full CRUD operations', async () => {
      // Setup API components
      const userAPI = new API('users');
      const apiBase = new APIBase();
      const client = new FetchClient();

      // Configure routes
      apiBase.addRoute('users', '/api/users');
      apiBase.addRoute('userById', '/api/users/:id');

      // Configure settings
      apiBase.setConfig('baseURL', 'https://api.example.com');
      apiBase.setConfig('timeout', 5000);

      // Mock API responses
      mockFetch.mockSuccess('/api/users', 'POST', { ...sampleUser, id: 1 });
      mockFetch.mockSuccess('/api/users/1', 'GET', sampleUser);
      mockFetch.mockSuccess('/api/users/1', 'PUT', { ...sampleUser, name: 'Updated User' });
      mockFetch.mockSuccess('/api/users/1', 'DELETE', null);

      // CREATE
      const createResult = await client.request({
        url: apiBase.routes.users,
        method: 'POST',
        data: { name: sampleUser.name, email: sampleUser.email },
      });
      expect(createResult.id).toBe(1);

      // READ
      const readResult = await client.request({
        url: apiBase.routes.userById.replace(':id', '1'),
        method: 'GET',
      });
      expect(readResult).toEqual(sampleUser);

      // UPDATE
      const updateResult = await client.request({
        url: apiBase.routes.userById.replace(':id', '1'),
        method: 'PUT',
        data: { name: 'Updated User' },
      });
      expect(updateResult.name).toBe('Updated User');

      // DELETE
      const deleteResult = await client.request({
        url: apiBase.routes.userById.replace(':id', '1'),
        method: 'DELETE',
      });
      expect(deleteResult).toBeNull();

      // Verify all requests were made
      const requests = mockFetch.getRequests();
      expect(requests).toHaveLength(4);
      expect(requests[0].method).toBe('POST');
      expect(requests[1].method).toBe('GET');
      expect(requests[2].method).toBe('PUT');
      expect(requests[3].method).toBe('DELETE');
    });

    it('should handle error scenarios gracefully', async () => {
      const client = new FetchClient();
      const apiBase = new APIBase();
      
      apiBase.addRoute('users', '/api/users');
      apiBase.addRoute('userById', '/api/users/:id');

      // Mock various error responses
      mockFetch.mockError('/api/users/999', 'GET', 404, { error: 'User not found' });
      mockFetch.mockError('/api/users', 'POST', 422, { 
        error: 'Validation failed',
        details: ['Name is required']
      });
      mockFetch.mockError('/api/users/1', 'PUT', 500, { error: 'Internal server error' });

      // Test 404 error
      const notFoundResult = await client.request({
        url: apiBase.routes.userById.replace(':id', '999'),
        method: 'GET',
      });
      expect(notFoundResult.error).toBe('User not found');

      // Test validation error
      const validationResult = await client.request({
        url: apiBase.routes.users,
        method: 'POST',
        data: {},
      });
      expect(validationResult.error).toBe('Validation failed');
      expect(validationResult.details).toContain('Name is required');

      // Test server error
      const serverErrorResult = await client.request({
        url: apiBase.routes.userById.replace(':id', '1'),
        method: 'PUT',
        data: { name: 'Test' },
      });
      expect(serverErrorResult.error).toBe('Internal server error');
    });
  });

  describe('Multi-API coordination', () => {
    it('should handle multiple API buckets', async () => {
      // Create multiple API buckets
      const userAPI = new API('users');
      const productAPI = new API('products');
      const orderAPI = new API('orders');

      // Create shared base configuration
      const apiBase = new APIBase();
      apiBase.setConfig('baseURL', 'https://api.example.com');
      apiBase.setConfig('headers', { 'Authorization': 'Bearer token123' });

      // Add routes for each API
      apiBase.addRoute('users', '/api/users');
      apiBase.addRoute('products', '/api/products');
      apiBase.addRoute('orders', '/api/orders');
      apiBase.addRoute('userOrders', '/api/users/:id/orders');

      const client = new FetchClient();

      // Mock responses
      mockFetch.mockSuccess('/api/users', 'GET', [sampleUser]);
      mockFetch.mockSuccess('/api/products', 'GET', [sampleProduct]);
      mockFetch.mockSuccess('/api/users/1/orders', 'GET', [
        { id: 1, userId: 1, productId: 101, quantity: 2 }
      ]);

      // Execute requests across different APIs
      const usersResult = await client.request({
        url: apiBase.routes.users,
        method: 'GET',
      });

      const productsResult = await client.request({
        url: apiBase.routes.products,
        method: 'GET',
      });

      const userOrdersResult = await client.request({
        url: apiBase.routes.userOrders.replace(':id', '1'),
        method: 'GET',
      });

      expect(usersResult).toEqual([sampleUser]);
      expect(productsResult).toEqual([sampleProduct]);
      expect(userOrdersResult[0].userId).toBe(1);

      // Verify API buckets maintain their identity
      expect(userAPI.name).toBe('users');
      expect(productAPI.name).toBe('products');
      expect(orderAPI.name).toBe('orders');
    });

    it('should support API composition patterns', async () => {
      // Create a composite API manager
      class APIManager {
        private apiBase: APIBase;
        private client: APIClient;
        private apis: Map<string, API>;

        constructor() {
          this.apiBase = new APIBase();
          this.client = new FetchClient();
          this.apis = new Map();
        }

        addAPI(name: string): API {
          const api = new API(name);
          this.apis.set(name, api);
          return api;
        }

        addRoute(routeName: string, path: string): void {
          this.apiBase.addRoute(routeName, path);
        }

        setConfig(key: string, value: any): void {
          this.apiBase.setConfig(key, value);
        }

        async request(routeName: string, method: string, data?: any): Promise<any> {
          const url = this.apiBase.routes[routeName];
          if (!url) {
            throw new APIError(`Route '${routeName}' not found`);
          }

          return this.client.request({ url, method, data });
        }

        getAPI(name: string): API | undefined {
          return this.apis.get(name);
        }
      }

      const manager = new APIManager();
      
      // Setup APIs
      const userAPI = manager.addAPI('users');
      const productAPI = manager.addAPI('products');

      // Setup routes
      manager.addRoute('users', '/api/users');
      manager.addRoute('products', '/api/products');

      // Setup config
      manager.setConfig('apiKey', 'test-key-123');

      // Mock responses
      mockFetch.mockSuccess('/api/users', 'GET', [sampleUser]);
      mockFetch.mockSuccess('/api/products', 'GET', [sampleProduct]);

      // Use the manager
      const users = await manager.request('users', 'GET');
      const products = await manager.request('products', 'GET');

      expect(users).toEqual([sampleUser]);
      expect(products).toEqual([sampleProduct]);
      expect(manager.getAPI('users')).toBe(userAPI);
      expect(manager.getAPI('products')).toBe(productAPI);
    });
  });

  describe('Error handling integration', () => {
    it('should integrate APIError with client responses', async () => {
      const client = new FetchClient();
      
      // Wrapper function that converts responses to APIResult pattern
      async function apiRequest<T>(request: APIRequest): Promise<{ data?: T; error?: APIError }> {
        try {
          const response = await client.request<T>(request);
          
          // FetchClient returns the parsed JSON directly, not a response object
          // For this test, we'll assume success and return the data
          return { data: response };
        } catch (error) {
          return {
            error: new APIError(
              error instanceof Error ? error.message : 'Unknown error',
              { data: error }
            ),
          };
        }
      }

      // Test successful request
      mockFetch.mockSuccess('/api/users/1', 'GET', sampleUser);

      const successResult = await apiRequest<typeof sampleUser>({
        url: '/api/users/1',
        method: 'GET',
      });

      expect(successResult.data).toEqual(sampleUser);
      expect(successResult.error).toBeUndefined();

      // Test error request  
      mockFetch.mockError('/api/users/999', 'GET', 404, { error: 'Not found' });

      const errorResult = await apiRequest({
        url: '/api/users/999',
        method: 'GET',
      });

      // Since FetchClient returns error responses as data (not throwing),
      // the error result will contain the error response data
      expect(errorResult.data).toEqual({ error: 'Not found' });
      expect(errorResult.error).toBeUndefined();
    });

    it('should handle network failures gracefully', async () => {
      const client = new FetchClient();
      
      // Mock network failure
      restoreFetch();
      restoreFetch = mockGlobalFetch(vi.fn().mockRejectedValue(new Error('Network error')));

      try {
        await client.request({
          url: '/api/unreachable',
          method: 'GET',
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Network error');
      }
    });
  });

  describe('Real-world usage patterns', () => {
    it('should support RESTful API patterns', async () => {
      // Setup RESTful API structure
      const apiBase = new APIBase();
      const client = new FetchClient();

      // RESTful routes
      apiBase.addRoute('users.index', '/api/users');
      apiBase.addRoute('users.show', '/api/users/:id');
      apiBase.addRoute('users.create', '/api/users');
      apiBase.addRoute('users.update', '/api/users/:id');
      apiBase.addRoute('users.destroy', '/api/users/:id');
      
      // Nested resources
      apiBase.addRoute('users.posts.index', '/api/users/:userId/posts');
      apiBase.addRoute('users.posts.show', '/api/users/:userId/posts/:postId');

      // Mock all endpoints
      mockFetch.mockSuccess('/api/users', 'GET', [sampleUser]);
      mockFetch.mockSuccess('/api/users/1', 'GET', sampleUser);
      mockFetch.mockSuccess('/api/users', 'POST', { ...sampleUser, id: 2 });
      mockFetch.mockSuccess('/api/users/1', 'PUT', { ...sampleUser, name: 'Updated' });
      mockFetch.mockSuccess('/api/users/1', 'DELETE', null);
      mockFetch.mockSuccess('/api/users/1/posts', 'GET', [
        { id: 1, title: 'Test Post', userId: 1 }
      ]);

      // Test RESTful operations
      const indexResult = await client.request({
        url: apiBase.routes['users.index'],
        method: 'GET',
      });

      const showResult = await client.request({
        url: apiBase.routes['users.show'].replace(':id', '1'),
        method: 'GET',
      });

      const createResult = await client.request({
        url: apiBase.routes['users.create'],
        method: 'POST',
        data: { name: 'New User', email: 'new@example.com' },
      });

      const updateResult = await client.request({
        url: apiBase.routes['users.update'].replace(':id', '1'),
        method: 'PUT',
        data: { name: 'Updated' },
      });

      const destroyResult = await client.request({
        url: apiBase.routes['users.destroy'].replace(':id', '1'),
        method: 'DELETE',
      });

      const nestedResult = await client.request({
        url: apiBase.routes['users.posts.index'].replace(':userId', '1'),
        method: 'GET',
      });

      expect(indexResult).toEqual([sampleUser]);
      expect(showResult).toEqual(sampleUser);
      expect(createResult.id).toBe(2);
      expect(updateResult.name).toBe('Updated');
      expect(destroyResult).toBeNull();
      expect(nestedResult[0].title).toBe('Test Post');
    });

    it('should support pagination and filtering', async () => {
      const apiBase = new APIBase();
      const client = new FetchClient();

      apiBase.addRoute('users.paginated', '/api/users');
      apiBase.setConfig('defaultPageSize', 10);

      // Mock paginated response
      const paginatedResponse = {
        data: [sampleUser],
        pagination: {
          currentPage: 1,
          totalPages: 5,
          totalItems: 50,
          pageSize: 10,
        },
      };

      mockFetch.mockSuccess('/api/users?page=1&limit=10&filter=active', 'GET', paginatedResponse);

      const result = await client.request({
        url: `${apiBase.routes['users.paginated']}?page=1&limit=10&filter=active`,
        method: 'GET',
      });

      expect(result.data).toEqual([sampleUser]);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalItems).toBe(50);
    });

    it('should support authentication workflows', async () => {
      const authAPI = new API('auth');
      const apiBase = new APIBase();
      const client = new FetchClient();

      // Auth routes
      apiBase.addRoute('auth.login', '/api/auth/login');
      apiBase.addRoute('auth.logout', '/api/auth/logout');
      apiBase.addRoute('auth.refresh', '/api/auth/refresh');
      apiBase.addRoute('auth.profile', '/api/auth/profile');

      // Mock auth responses
      mockFetch.mockSuccess('/api/auth/login', 'POST', {
        user: sampleUser,
        token: 'jwt-token-123',
        refreshToken: 'refresh-token-456',
      });

      mockFetch.mockSuccess('/api/auth/profile', 'GET', sampleUser);
      mockFetch.mockSuccess('/api/auth/logout', 'POST', { success: true });

      // Login flow
      const loginResult = await client.request({
        url: apiBase.routes['auth.login'],
        method: 'POST',
        data: { email: 'test@example.com', password: 'password123' },
      });

      expect(loginResult.user).toEqual(sampleUser);
      expect(loginResult.token).toBe('jwt-token-123');

      // Authenticated request (simulate adding token to config)
      apiBase.setConfig('authToken', loginResult.token);

      const profileResult = await client.request({
        url: apiBase.routes['auth.profile'],
        method: 'GET',
      });

      expect(profileResult).toEqual(sampleUser);

      // Logout
      const logoutResult = await client.request({
        url: apiBase.routes['auth.logout'],
        method: 'POST',
      });

      expect(logoutResult.success).toBe(true);
      expect(authAPI.name).toBe('auth');
    });
  });

  describe('Performance and scalability', () => {
    it('should handle concurrent requests efficiently', async () => {
      const client = new FetchClient();
      const apiBase = new APIBase();

      // Setup multiple routes
      for (let i = 0; i < 10; i++) {
        apiBase.addRoute(`resource${i}`, `/api/resource${i}`);
        mockFetch.mockSuccess(`/api/resource${i}`, 'GET', { id: i, name: `Resource ${i}` });
      }

      // Execute concurrent requests
      const promises: Promise<any>[] = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          client.request({
            url: apiBase.routes[`resource${i}`],
            method: 'GET',
          })
        );
      }

      const results = await Promise.all(promises);

      expect(results).toHaveLength(10);
      results.forEach((result, index) => {
        expect(result.id).toBe(index);
        expect(result.name).toBe(`Resource ${index}`);
      });

      // All requests should have been made
      expect(mockFetch.getRequests()).toHaveLength(10);
    });

    it('should maintain performance with large configurations', () => {
      const apiBase = new APIBase();
      
      // Add many routes and configs
      const startTime = Date.now();
      
      for (let i = 0; i < 1000; i++) {
        apiBase.addRoute(`route${i}`, `/api/route${i}`);
        apiBase.setConfig(`config${i}`, `value${i}`);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(Object.keys(apiBase.routes)).toHaveLength(1000);
      expect(Object.keys(apiBase.config)).toHaveLength(1000);
      expect(duration).toBeLessThan(100); // Should be fast

      // Verify random access is still efficient
      expect(apiBase.routes.route500).toBe('/api/route500');
      expect(apiBase.config.config500).toBe('value500');
    });
  });
});
