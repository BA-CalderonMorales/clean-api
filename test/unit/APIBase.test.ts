/**
 * Unit tests for APIBase class.
 * Tests route management, configuration handling, and base API functionality.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { APIBase } from '../../src/APIBase';
import { sampleRoutes, sampleConfig } from '../__mocks__/fixtures';
import { assertImplementsInterface } from '../utils/testHelpers';

describe('APIBase', () => {
  let apiBase: APIBase;

  beforeEach(() => {
    apiBase = new APIBase();
  });

  describe('Constructor', () => {
    it('should create instance with empty routes and config', () => {
      expect(apiBase).toBeInstanceOf(APIBase);
      expect(apiBase.routes).toEqual({});
      expect(apiBase.config).toEqual({});
    });

    it('should have correct interface structure', () => {
      assertImplementsInterface(
        apiBase,
        ['addRoute', 'setConfig'],
        ['routes', 'config']
      );
    });
  });

  describe('Route management', () => {
    describe('addRoute method', () => {
      it('should add single route', () => {
        apiBase.addRoute('users', '/api/users');
        
        expect(apiBase.routes).toHaveProperty('users');
        expect(apiBase.routes.users).toBe('/api/users');
      });

      it('should add multiple routes', () => {
        apiBase.addRoute('users', '/api/users');
        apiBase.addRoute('products', '/api/products');
        apiBase.addRoute('orders', '/api/orders');

        expect(Object.keys(apiBase.routes)).toHaveLength(3);
        expect(apiBase.routes.users).toBe('/api/users');
        expect(apiBase.routes.products).toBe('/api/products');
        expect(apiBase.routes.orders).toBe('/api/orders');
      });

      it('should handle route with parameters', () => {
        apiBase.addRoute('userById', '/api/users/:id');
        apiBase.addRoute('userPosts', '/api/users/:userId/posts/:postId');

        expect(apiBase.routes.userById).toBe('/api/users/:id');
        expect(apiBase.routes.userPosts).toBe('/api/users/:userId/posts/:postId');
      });

      it('should handle complex route patterns', () => {
        const complexRoutes = {
          search: '/api/search?q=:query&page=:page',
          nested: '/api/v1/organizations/:orgId/projects/:projectId/issues',
          wildcard: '/api/files/*',
        };

        Object.entries(complexRoutes).forEach(([name, path]) => {
          apiBase.addRoute(name, path);
        });

        expect(apiBase.routes.search).toBe('/api/search?q=:query&page=:page');
        expect(apiBase.routes.nested).toBe('/api/v1/organizations/:orgId/projects/:projectId/issues');
        expect(apiBase.routes.wildcard).toBe('/api/files/*');
      });

      it('should overwrite existing route', () => {
        apiBase.addRoute('users', '/api/v1/users');
        apiBase.addRoute('users', '/api/v2/users');

        expect(apiBase.routes.users).toBe('/api/v2/users');
        expect(Object.keys(apiBase.routes)).toHaveLength(1);
      });

      it('should handle empty string route name', () => {
        apiBase.addRoute('', '/api/empty');
        
        expect(apiBase.routes['']).toBe('/api/empty');
      });

      it('should handle empty string route path', () => {
        apiBase.addRoute('empty', '');
        
        expect(apiBase.routes.empty).toBe('');
      });

      it('should handle special characters in route names', () => {
        const specialNames = ['user-profile', 'user_posts', 'user.details', 'user@domain'];
        
        specialNames.forEach(name => {
          apiBase.addRoute(name, `/api/${name}`);
          expect(apiBase.routes[name]).toBe(`/api/${name}`);
        });
      });
    });

    describe('Routes property', () => {
      it('should be directly accessible', () => {
        apiBase.addRoute('test', '/api/test');
        
        expect(apiBase.routes.test).toBe('/api/test');
        expect(typeof apiBase.routes).toBe('object');
      });

      it('should support object spread', () => {
        apiBase.addRoute('users', '/api/users');
        apiBase.addRoute('products', '/api/products');

        const routesCopy = { ...apiBase.routes };
        expect(routesCopy).toEqual(apiBase.routes);
        expect(routesCopy).not.toBe(apiBase.routes); // Different reference
      });

      it('should support Object.keys enumeration', () => {
        Object.entries(sampleRoutes).forEach(([name, path]) => {
          apiBase.addRoute(name, path);
        });

        const keys = Object.keys(apiBase.routes);
        expect(keys).toEqual(Object.keys(sampleRoutes));
      });
    });
  });

  describe('Configuration management', () => {
    describe('setConfig method', () => {
      it('should set single configuration option', () => {
        apiBase.setConfig('baseURL', 'https://api.example.com');
        
        expect(apiBase.config).toHaveProperty('baseURL');
        expect(apiBase.config.baseURL).toBe('https://api.example.com');
      });

      it('should set multiple configuration options', () => {
        apiBase.setConfig('baseURL', 'https://api.example.com');
        apiBase.setConfig('timeout', 5000);
        apiBase.setConfig('retries', 3);

        expect(Object.keys(apiBase.config)).toHaveLength(3);
        expect(apiBase.config.baseURL).toBe('https://api.example.com');
        expect(apiBase.config.timeout).toBe(5000);
        expect(apiBase.config.retries).toBe(3);
      });

      it('should handle various data types', () => {
        const configValues = {
          string: 'test string',
          number: 42,
          boolean: true,
          array: [1, 2, 3],
          object: { nested: { value: 'deep' } },
          null: null,
          undefined: undefined,
        };

        Object.entries(configValues).forEach(([key, value]) => {
          apiBase.setConfig(key, value);
        });

        Object.entries(configValues).forEach(([key, value]) => {
          expect(apiBase.config[key]).toEqual(value);
        });
      });

      it('should overwrite existing configuration', () => {
        apiBase.setConfig('timeout', 3000);
        apiBase.setConfig('timeout', 10000);

        expect(apiBase.config.timeout).toBe(10000);
        expect(Object.keys(apiBase.config)).toHaveLength(1);
      });

      it('should handle complex configuration objects', () => {
        const complexConfig = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer token123',
            'Custom-Header': 'custom-value',
          },
          retryPolicy: {
            maxRetries: 3,
            retryDelay: 1000,
            backoffMultiplier: 2,
          },
        };

        apiBase.setConfig('headers', complexConfig.headers);
        apiBase.setConfig('retryPolicy', complexConfig.retryPolicy);

        expect(apiBase.config.headers).toEqual(complexConfig.headers);
        expect(apiBase.config.retryPolicy).toEqual(complexConfig.retryPolicy);
        expect(apiBase.config.retryPolicy.maxRetries).toBe(3);
      });
    });

    describe('Config property', () => {
      it('should be directly accessible', () => {
        apiBase.setConfig('test', 'value');
        
        expect(apiBase.config.test).toBe('value');
        expect(typeof apiBase.config).toBe('object');
      });

      it('should support object spread', () => {
        Object.entries(sampleConfig).forEach(([key, value]) => {
          apiBase.setConfig(key, value);
        });

        const configCopy = { ...apiBase.config };
        expect(configCopy).toEqual(apiBase.config);
        expect(configCopy).not.toBe(apiBase.config); // Different reference
      });
    });
  });

  describe('Integration scenarios', () => {
    it('should handle mixed route and config operations', () => {
      // Add routes
      apiBase.addRoute('users', '/api/users');
      apiBase.addRoute('userById', '/api/users/:id');
      
      // Set configuration
      apiBase.setConfig('baseURL', 'https://api.example.com');
      apiBase.setConfig('timeout', 5000);

      expect(apiBase.routes).toHaveProperty('users');
      expect(apiBase.routes).toHaveProperty('userById');
      expect(apiBase.config).toHaveProperty('baseURL');
      expect(apiBase.config).toHaveProperty('timeout');

      expect(Object.keys(apiBase.routes)).toHaveLength(2);
      expect(Object.keys(apiBase.config)).toHaveLength(2);
    });

    it('should maintain independence between routes and config', () => {
      apiBase.addRoute('test', '/api/test');
      apiBase.setConfig('test', 'config-value');

      expect(apiBase.routes.test).toBe('/api/test');
      expect(apiBase.config.test).toBe('config-value');
    });

    it('should support builder pattern usage', () => {
      // While APIBase doesn't return 'this', it can still be used in a builder-like way
      apiBase.addRoute('users', '/api/users');
      apiBase.setConfig('baseURL', 'https://api.example.com');
      apiBase.addRoute('products', '/api/products');
      apiBase.setConfig('timeout', 5000);

      expect(apiBase.routes.users).toBe('/api/users');
      expect(apiBase.routes.products).toBe('/api/products');
      expect(apiBase.config.baseURL).toBe('https://api.example.com');
      expect(apiBase.config.timeout).toBe(5000);
    });

    it('should handle large numbers of routes and configs', () => {
      // Add many routes
      for (let i = 0; i < 100; i++) {
        apiBase.addRoute(`route${i}`, `/api/route${i}`);
      }

      // Add many configs
      for (let i = 0; i < 50; i++) {
        apiBase.setConfig(`config${i}`, `value${i}`);
      }

      expect(Object.keys(apiBase.routes)).toHaveLength(100);
      expect(Object.keys(apiBase.config)).toHaveLength(50);
      expect(apiBase.routes.route50).toBe('/api/route50');
      expect(apiBase.config.config25).toBe('value25');
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined values gracefully', () => {
      apiBase.addRoute('undefined', undefined as any);
      apiBase.setConfig('undefined', undefined);

      expect(apiBase.routes.undefined).toBeUndefined();
      expect(apiBase.config.undefined).toBeUndefined();
    });

    it('should handle null values', () => {
      apiBase.addRoute('null', null as any);
      apiBase.setConfig('null', null);

      expect(apiBase.routes.null).toBeNull();
      expect(apiBase.config.null).toBeNull();
    });

    it('should handle numeric keys', () => {
      apiBase.addRoute('123', '/api/numeric');
      apiBase.setConfig('456', 'numeric-config');

      expect(apiBase.routes['123']).toBe('/api/numeric');
      expect(apiBase.config['456']).toBe('numeric-config');
    });

    it('should handle symbol keys', () => {
      const symbolKey = Symbol('test');
      apiBase.addRoute(symbolKey as any, '/api/symbol');
      apiBase.setConfig(symbolKey as any, 'symbol-config');

      expect(apiBase.routes[symbolKey as any]).toBe('/api/symbol');
      expect(apiBase.config[symbolKey as any]).toBe('symbol-config');
    });
  });

  describe('Memory management', () => {
    it('should allow clearing routes by reassignment', () => {
      apiBase.addRoute('temp', '/api/temp');
      expect(apiBase.routes.temp).toBe('/api/temp');

      // Clear by creating new instance (typical usage pattern)
      const newApiBase = new APIBase();
      expect(newApiBase.routes).toEqual({});
    });

    it('should handle modifications to returned objects', () => {
      apiBase.addRoute('users', '/api/users');
      
      // Get reference to routes
      const routes = apiBase.routes;
      routes.modified = '/api/modified';

      // Should affect the original object (same reference)
      expect(apiBase.routes.modified).toBe('/api/modified');
    });
  });
});
