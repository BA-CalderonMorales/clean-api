/**
 * API
 * Provides a way to keep APIs structured to a particular bucket.
 * Example: group related endpoints here for a specific domain or feature.
 */
export class API {
	/**
	 * Create a new API bucket.
	 * @param name - The name of the API bucket (e.g., 'users', 'products').
	 */
	constructor(public name: string) {}
}
