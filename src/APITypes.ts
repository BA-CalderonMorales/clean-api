/**
 * APITypes
 * Provides an easy way to tap into the types for this library.
 */

/**
 * Supported HTTP methods for API requests.
 */
export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * Structure for an API request.
 * @property url - The endpoint URL for the request.
 * @property method - The HTTP method to use.
 * @property data - Optional data to send with the request.
 */
export interface APIRequest {
	/** The endpoint URL for the request. */
	url: string;
	/** The HTTP method to use. */
	method: HTTPMethod;
	/** Optional data to send with the request. */
	data?: any;
}

/**
 * APIResponse
 * Structure for a raw HTTP API response.
 *
 * Use this to represent the actual HTTP response from the server, including status code and data.
 * This is different from APIResult, which is designed for ergonomic client usage.
 */
export interface APIResponse<T = any> {
  /** The response data. */
  data: T;
  /** The HTTP status code. */
  status: number;
}

/**
 * APIResult
 * Generic type for ergonomic API client results.
 *
 * Use this as the return type for your API client methods.
 * It allows consumers to easily destructure `{ data, error }` from the result:
 *
 *   const { data, error } = await api.someMethod();
 *
 * This pattern is different from APIResponse, which represents the raw HTTP response.
 */
export type APIResult<T> = Promise<{ data?: T; error?: Error }>;