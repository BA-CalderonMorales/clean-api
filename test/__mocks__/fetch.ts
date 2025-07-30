/**
 * Mock implementation of the Fetch API for testing purposes.
 * Provides controlled responses for HTTP requests without making actual network calls.
 */

export interface MockResponse {
  data: any;
  status: number;
  ok: boolean;
  statusText: string;
}

export interface MockRequest {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: string;
}

/**
 * Mock fetch implementation that can be configured to return specific responses.
 */
export class MockFetch {
  private responses: Map<string, MockResponse> = new Map();
  private requests: MockRequest[] = [];

  /**
   * Set up a mock response for a specific URL and method combination.
   * @param url - The URL to mock
   * @param method - The HTTP method to mock
   * @param response - The response to return
   */
  mockResponse(url: string, method: string, response: Partial<MockResponse>): void {
    const key = `${method.toUpperCase()}:${url}`;
    this.responses.set(key, {
      data: {},
      status: 200,
      ok: true,
      statusText: 'OK',
      ...response,
    });
  }

  /**
   * Mock implementation of fetch that returns configured responses.
   */
  fetch = async (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
    const url = typeof input === 'string' ? input : input.toString();
    const method = init.method || 'GET';
    const key = `${method.toUpperCase()}:${url}`;
    
    // Record the request
    this.requests.push({
      url,
      method,
      headers: init.headers as Record<string, string>,
      body: init.body as string,
    });

    // Get mock response
    const mockResponse = this.responses.get(key);
    if (!mockResponse) {
      throw new Error(`No mock response configured for ${method} ${url}`);
    }

    // Create a mock Response object
    const response = {
      ok: mockResponse.ok,
      status: mockResponse.status,
      statusText: mockResponse.statusText,
      json: async () => mockResponse.data,
      text: async () => JSON.stringify(mockResponse.data),
      headers: new Headers(),
    } as Response;

    return response;
  };

  /**
   * Get all requests that were made during testing.
   */
  getRequests(): MockRequest[] {
    return [...this.requests];
  }

  /**
   * Get the last request that was made.
   */
  getLastRequest(): MockRequest | undefined {
    return this.requests[this.requests.length - 1];
  }

  /**
   * Clear all recorded requests and responses.
   */
  reset(): void {
    this.responses.clear();
    this.requests.length = 0;
  }

  /**
   * Set up common success responses for testing.
   */
  mockSuccess(url: string, method: string = 'GET', data: any = {}): void {
    this.mockResponse(url, method, {
      data,
      status: 200,
      ok: true,
      statusText: 'OK',
    });
  }

  /**
   * Set up common error responses for testing.
   */
  mockError(url: string, method: string = 'GET', status: number = 500, data: any = {}): void {
    this.mockResponse(url, method, {
      data,
      status,
      ok: false,
      statusText: 'Internal Server Error',
    });
  }
}

/**
 * Global mock fetch instance for use in tests.
 */
export const mockFetch = new MockFetch();
