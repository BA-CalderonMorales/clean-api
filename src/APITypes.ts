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
 * Structure for an API response.
 * @template T - The type of the response data.
 * @property data - The response data.
 * @property status - The HTTP status code.
 */
export interface APIResponse<T = any> {
	/** The response data. */
	data: T;
	/** The HTTP status code. */
	status: number;
}
