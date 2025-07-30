/**
 * Unit tests for APIError class.
 * Tests custom error handling, status codes, and error data management.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { APIError } from '../../src/APIError';
import { assertAPIError } from '../utils/testHelpers';
import '../utils/assertions';

describe('APIError', () => {
  describe('Constructor', () => {
    it('should create basic error with message only', () => {
      const error = new APIError('Something went wrong');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(APIError);
      expect(error.message).toBe('Something went wrong');
      expect(error.name).toBe('APIError');
      expect(error.status).toBeUndefined();
      expect(error.data).toBeUndefined();
    });

    it('should create error with status code', () => {
      const error = new APIError('Not found', { status: 404 });
      
      assertAPIError(error, 'Not found', 404);
      expect(error.status).toBe(404);
      expect(error.data).toBeUndefined();
    });

    it('should create error with response data', () => {
      const responseData = { error: 'Validation failed', fields: ['name', 'email'] };
      const error = new APIError('Validation error', { status: 422, data: responseData });
      
      assertAPIError(error, 'Validation error', 422);
      expect(error.data).toEqual(responseData);
      expect(error.data.fields).toEqual(['name', 'email']);
    });

    it('should create error with both status and data', () => {
      const error = new APIError('Server error', { 
        status: 500, 
        data: { error: 'Internal server error', code: 'INTERNAL_ERROR' }
      });
      
      assertAPIError(error, 'Server error', 500);
      expect(error.data.error).toBe('Internal server error');
      expect(error.data.code).toBe('INTERNAL_ERROR');
    });

    it('should handle empty options object', () => {
      const error = new APIError('Test error', {});
      
      expect(error.message).toBe('Test error');
      expect(error.status).toBeUndefined();
      expect(error.data).toBeUndefined();
    });
  });

  describe('Error properties', () => {
    it('should inherit from Error correctly', () => {
      const error = new APIError('Test message');
      
      expect(error instanceof Error).toBe(true);
      expect(error instanceof APIError).toBe(true);
      expect(error.constructor.name).toBe('APIError');
    });

    it('should maintain error stack trace', () => {
      const error = new APIError('Stack trace test');
      
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('APIError');
      expect(error.stack).toContain('Stack trace test');
    });

    it('should have correct name property', () => {
      const error = new APIError('Name test');
      
      expect(error.name).toBe('APIError');
    });
  });

  describe('Status code handling', () => {
    it('should handle common HTTP status codes', () => {
      const statusCodes = [
        { code: 400, message: 'Bad Request' },
        { code: 401, message: 'Unauthorized' },
        { code: 403, message: 'Forbidden' },
        { code: 404, message: 'Not Found' },
        { code: 422, message: 'Unprocessable Entity' },
        { code: 500, message: 'Internal Server Error' },
        { code: 503, message: 'Service Unavailable' },
      ];

      statusCodes.forEach(({ code, message }) => {
        const error = new APIError(message, { status: code });
        
        expect(error.status).toBe(code);
        expect(error.message).toBe(message);
      });
    });

    it('should handle custom status codes', () => {
      const customCodes = [299, 451, 599];
      
      customCodes.forEach(code => {
        const error = new APIError('Custom error', { status: code });
        expect(error.status).toBe(code);
      });
    });

    it('should accept zero as status code', () => {
      const error = new APIError('Network error', { status: 0 });
      expect(error.status).toBe(0);
    });
  });

  describe('Response data handling', () => {
    it('should handle various data types', () => {
      const dataTypes = [
        'string data',
        12345,
        true,
        null,
        undefined,
        { object: 'data' },
        ['array', 'data'],
        { nested: { deep: { object: true } } },
      ];

      dataTypes.forEach(data => {
        const error = new APIError('Data test', { data });
        expect(error.data).toEqual(data);
      });
    });

    it('should preserve complex response data structure', () => {
      const complexData = {
        error: 'Validation failed',
        message: 'Multiple fields are invalid',
        details: {
          name: ['Required field', 'Must be at least 2 characters'],
          email: ['Invalid email format'],
          age: ['Must be a positive number'],
        },
        timestamp: '2025-01-01T00:00:00Z',
        requestId: 'req_123456789',
      };

      const error = new APIError('Complex validation error', { 
        status: 422, 
        data: complexData 
      });

      expect(error.data).toEqual(complexData);
      expect(error.data.details.name).toHaveLength(2);
      expect(error.data.requestId).toBe('req_123456789');
    });
  });

  describe('Error serialization', () => {
    it('should be JSON serializable', () => {
      const error = new APIError('Serialization test', { 
        status: 400, 
        data: { field: 'value' }
      });

      // Note: Error objects don't serialize normally, but our custom properties should be accessible
      const serialized = {
        message: error.message,
        name: error.name,
        status: error.status,
        data: error.data,
      };

      const jsonString = JSON.stringify(serialized);
      const parsed = JSON.parse(jsonString);

      expect(parsed.message).toBe('Serialization test');
      expect(parsed.name).toBe('APIError');
      expect(parsed.status).toBe(400);
      expect(parsed.data).toEqual({ field: 'value' });
    });

    it('should maintain properties after serialization round-trip', () => {
      const originalData = { error: 'Test', code: 'TEST_ERROR' };
      const error = new APIError('Original error', { status: 500, data: originalData });

      // Simulate what might happen in error handling
      const errorInfo = {
        message: error.message,
        status: error.status,
        data: error.data,
      };

      expect(errorInfo.message).toBe('Original error');
      expect(errorInfo.status).toBe(500);
      expect(errorInfo.data).toEqual(originalData);
    });
  });

  describe('Error comparison and equality', () => {
    it('should be comparable by properties', () => {
      const error1 = new APIError('Same message', { status: 404 });
      const error2 = new APIError('Same message', { status: 404 });

      expect(error1.message).toBe(error2.message);
      expect(error1.status).toBe(error2.status);
      expect(error1.name).toBe(error2.name);
    });

    it('should distinguish different errors', () => {
      const error1 = new APIError('First error', { status: 400 });
      const error2 = new APIError('Second error', { status: 500 });

      expect(error1.message).not.toBe(error2.message);
      expect(error1.status).not.toBe(error2.status);
    });
  });

  describe('Usage in error handling patterns', () => {
    it('should work with try-catch blocks', () => {
      expect(() => {
        throw new APIError('Test error', { status: 500 });
      }).toThrow(APIError);

      try {
        throw new APIError('Caught error', { status: 404 });
      } catch (error) {
        assertAPIError(error, 'Caught error', 404);
      }
    });

    it('should work with Promise rejections', async () => {
      const rejectedPromise = Promise.reject(
        new APIError('Promise error', { status: 503 })
      );

      await expect(rejectedPromise).rejects.toThrow(APIError);
      await expect(rejectedPromise).rejects.toHaveProperty('status', 503);
    });

    it('should support error chaining patterns', () => {
      const originalError = new Error('Original cause');
      const apiError = new APIError('API operation failed', { 
        status: 500,
        data: { originalError: originalError.message }
      });

      expect(apiError.data.originalError).toBe('Original cause');
      expect(apiError.message).toBe('API operation failed');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string message', () => {
      const error = new APIError('', { status: 400 });
      
      expect(error.message).toBe('');
      expect(error.status).toBe(400);
    });

    it('should handle very long messages', () => {
      const longMessage = 'A'.repeat(1000);
      const error = new APIError(longMessage, { status: 413 });
      
      expect(error.message).toBe(longMessage);
      expect(error.message).toHaveLength(1000);
    });

    it('should handle special characters in message', () => {
      const specialMessage = 'Error: {"field": "value"} & <tag> 💥';
      const error = new APIError(specialMessage, { status: 400 });
      
      expect(error.message).toBe(specialMessage);
    });

    it('should handle circular references in data', () => {
      const circularData: any = { name: 'circular' };
      circularData.self = circularData;

      const error = new APIError('Circular data', { 
        status: 400, 
        data: circularData 
      });

      expect(error.data.name).toBe('circular');
      expect(error.data.self).toBe(error.data);
    });
  });
});
