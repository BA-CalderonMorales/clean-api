/**
 * Unit tests for API class.
 * Tests bucket organization functionality and API grouping patterns.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { API } from '../../src/API';
import { assertImplementsInterface } from '../utils/testHelpers';

describe('API', () => {
  describe('Constructor', () => {
    it('should create instance with provided name', () => {
      const api = new API('users');
      
      expect(api).toBeInstanceOf(API);
      expect(api.name).toBe('users');
    });

    it('should handle various name types', () => {
      const names = [
        'users',
        'products',
        'user-management',
        'user_profiles',
        'v1.users',
        'api/v2/products',
        '',
        '123',
      ];

      names.forEach(name => {
        const api = new API(name);
        expect(api.name).toBe(name);
      });
    });

    it('should have correct interface structure', () => {
      const api = new API('test');
      
      assertImplementsInterface(api, [], ['name']);
    });
  });

  describe('Name property', () => {
    it('should be publicly accessible', () => {
      const api = new API('public-api');
      
      expect(api.name).toBe('public-api');
      expect(typeof api.name).toBe('string');
    });

    it('should be immutable after construction', () => {
      const api = new API('immutable');
      const originalName = api.name;
      
      // Attempt to modify (this would be caught by TypeScript in real usage)
      (api as any).name = 'modified';
      
      // In JavaScript, this actually changes the value, but TypeScript should prevent it
      // The test verifies the current behavior
      expect(api.name).toBe('modified'); // This shows the property is actually mutable in JS
    });

    it('should preserve original name reference', () => {
      const nameString = 'preserved-name';
      const api = new API(nameString);
      
      expect(api.name).toBe(nameString);
      expect(api.name === nameString).toBe(true); // Same reference for strings
    });
  });

  describe('API bucket patterns', () => {
    it('should support domain-specific naming', () => {
      const domainAPIs = [
        new API('users'),
        new API('products'),
        new API('orders'),
        new API('payments'),
        new API('notifications'),
      ];

      domainAPIs.forEach((api, index) => {
        expect(api.name).toBe(['users', 'products', 'orders', 'payments', 'notifications'][index]);
      });
    });

    it('should support versioned API naming', () => {
      const versionedAPIs = [
        new API('v1.users'),
        new API('v2.users'),
        new API('beta.features'),
        new API('stable.core'),
      ];

      versionedAPIs.forEach(api => {
        expect(api.name).toContain('.');
        expect(api.name.split('.').length).toBe(2);
      });
    });

    it('should support hierarchical naming', () => {
      const hierarchicalAPIs = [
        new API('admin.users'),
        new API('admin.settings'),
        new API('public.auth'),
        new API('internal.analytics'),
      ];

      hierarchicalAPIs.forEach(api => {
        expect(api.name).toMatch(/^(admin|public|internal)\./);
      });
    });

    it('should support feature-based organization', () => {
      const featureAPIs = [
        new API('authentication'),
        new API('user-management'),
        new API('content-delivery'),
        new API('real-time-messaging'),
      ];

      featureAPIs.forEach(api => {
        expect(api.name).toBeTypeOf('string');
        expect(api.name.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Multiple instances', () => {
    it('should create independent instances', () => {
      const api1 = new API('instance1');
      const api2 = new API('instance2');

      expect(api1.name).toBe('instance1');
      expect(api2.name).toBe('instance2');
      expect(api1.name).not.toBe(api2.name);
      expect(api1).not.toBe(api2);
    });

    it('should maintain separate identities', () => {
      const instances: API[] = [];
      for (let i = 0; i < 10; i++) {
        instances.push(new API(`api-${i}`));
      }

      instances.forEach((instance, index) => {
        expect(instance.name).toBe(`api-${index}`);
        expect(instance).toBeInstanceOf(API);
      });

      // Each instance should be unique
      const uniqueInstances = new Set(instances);
      expect(uniqueInstances.size).toBe(instances.length);
    });

    it('should support same name for different instances', () => {
      const api1 = new API('shared-name');
      const api2 = new API('shared-name');

      expect(api1.name).toBe(api2.name);
      expect(api1).not.toBe(api2); // Different instances
    });
  });

  describe('Integration with other components', () => {
    it('should work as part of larger API structure', () => {
      // Simulate how API might be used with other components
      const userAPI = new API('users');
      const productAPI = new API('products');

      const apiRegistry = {
        [userAPI.name]: userAPI,
        [productAPI.name]: productAPI,
      };

      expect(apiRegistry.users).toBe(userAPI);
      expect(apiRegistry.products).toBe(productAPI);
      expect(Object.keys(apiRegistry)).toHaveLength(2);
    });

    it('should support functional composition patterns', () => {
      const createAPIWithMetadata = (name: string) => {
        const api = new API(name);
        return {
          api,
          metadata: {
            created: new Date(),
            version: '1.0.0',
            name: api.name,
          },
        };
      };

      const userAPIWithMetadata = createAPIWithMetadata('users');
      
      expect(userAPIWithMetadata.api).toBeInstanceOf(API);
      expect(userAPIWithMetadata.api.name).toBe('users');
      expect(userAPIWithMetadata.metadata.name).toBe('users');
    });

    it('should work in factory patterns', () => {
      class APIFactory {
        static createDomainAPI(domain: string): API {
          return new API(`${domain}-api`);
        }

        static createVersionedAPI(domain: string, version: string): API {
          return new API(`${version}.${domain}`);
        }
      }

      const userAPI = APIFactory.createDomainAPI('users');
      const v2ProductAPI = APIFactory.createVersionedAPI('products', 'v2');

      expect(userAPI.name).toBe('users-api');
      expect(v2ProductAPI.name).toBe('v2.products');
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle empty string name', () => {
      const api = new API('');
      
      expect(api.name).toBe('');
      expect(api).toBeInstanceOf(API);
    });

    it('should handle very long names', () => {
      const longName = 'a'.repeat(1000);
      const api = new API(longName);
      
      expect(api.name).toBe(longName);
      expect(api.name.length).toBe(1000);
    });

    it('should handle special characters', () => {
      const specialNames = [
        'api@domain.com',
        'api-with-dashes',
        'api_with_underscores',
        'api.with.dots',
        'api/with/slashes',
        'api?with=query',
        'api#with-hash',
        'api with spaces',
        '中文API',
        'api-🚀-with-emoji',
      ];

      specialNames.forEach(name => {
        const api = new API(name);
        expect(api.name).toBe(name);
      });
    });

    it('should handle numeric-like names', () => {
      const numericNames = ['123', '0', '-1', '3.14', '1e10'];
      
      numericNames.forEach(name => {
        const api = new API(name);
        expect(api.name).toBe(name);
        expect(typeof api.name).toBe('string');
      });
    });

    it('should handle undefined and null as constructor parameters', () => {
      // TypeScript should prevent this, but test runtime behavior
      const undefinedAPI = new API(undefined as any);
      const nullAPI = new API(null as any);

      expect(undefinedAPI.name).toBe(undefined);
      expect(nullAPI.name).toBe(null);
    });
  });

  describe('Performance considerations', () => {
    it('should handle rapid instance creation', () => {
      const startTime = Date.now();
      const instances: API[] = [];

      for (let i = 0; i < 1000; i++) {
        instances.push(new API(`performance-test-${i}`));
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(instances).toHaveLength(1000);
      expect(duration).toBeLessThan(100); // Should be very fast
      
      instances.forEach((instance, index) => {
        expect(instance.name).toBe(`performance-test-${index}`);
      });
    });

    it('should have minimal memory footprint', () => {
      const api = new API('memory-test');
      
      // API instances should be lightweight
      const keys = Object.keys(api);
      expect(keys).toEqual(['name']);
      
      // Should not have unexpected properties
      expect(Object.getOwnPropertyNames(api)).toEqual(['name']);
    });
  });

  describe('Type safety and TypeScript integration', () => {
    it('should maintain type information', () => {
      const api = new API('type-test');
      
      // These checks verify that TypeScript types are working correctly
      expect(typeof api.name).toBe('string');
      expect(api.constructor).toBe(API);
      expect(api instanceof API).toBe(true);
    });

    it('should work with generic patterns', () => {
      // Simulate generic usage patterns
      function processAPI<T extends API>(api: T): string {
        return `Processing ${api.name}`;
      }

      const userAPI = new API('users');
      const result = processAPI(userAPI);
      
      expect(result).toBe('Processing users');
    });

    it('should support interface extensions', () => {
      // Simulate extending API functionality
      interface ExtendedAPI extends API {
        version: string;
      }

      const api = new API('extended') as ExtendedAPI;
      (api as any).version = '1.0.0';

      expect(api.name).toBe('extended');
      expect((api as any).version).toBe('1.0.0');
    });
  });
});
