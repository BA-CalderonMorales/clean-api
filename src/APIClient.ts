/**
 * APIClient
 * Provides a layer to which you can swap out clients at any point.
 * Defines the interface for making API requests.
 */
export interface APIClient {
	/**
	 * Make an API request.
	 * @param options - The request options including url, method, and optional data.
	 */
	request<T = any>(options: {
		url: string;
		method: string;
		data?: any;
	}): Promise<T>;
}

/**
 * FetchClient
 * Default implementation of APIClient using the Fetch API.
 */
export class FetchClient implements APIClient {
	/**
	 * Make an API request using fetch.
	 * @param options - The request options including url, method, and optional data.
	 */
	async request<T = any>({
		url,
		method,
		data,
	}: {
		url: string;
		method: string;
		data?: any;
	}): Promise<T> {
		const response = await fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: data ? JSON.stringify(data) : undefined,
		});
		return response.json();
	}
}
