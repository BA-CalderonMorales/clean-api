/**
 * APIError
 * Custom error class for handling API-related errors safely and consistently.
 *
 * Example usage:
 *   throw new APIError('Request failed', { status: 404, data: responseData });
 */
export class APIError extends Error {
	/** Optional status code returned by the API. */
	status?: number;
	/** Optional data returned by the API. */
	data?: any;

	/**
	 * Create a new APIError instance.
	 * @param message - The error message.
	 * @param options - Optional status and data from the API response.
	 */
	constructor(message: string, options?: { status?: number; data?: any }) {
		super(message);
		this.name = "APIError";
		if (options) {
			this.status = options.status;
			this.data = options.data;
		}
	}
}
