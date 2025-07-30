/**
 * APIBase
 * Provides a layer to which you can add routes and one-off configurations.
 */

export class APIBase {
	/**
	 * Stores route definitions for the API.
	 */
	routes: Record<string, string> = {};

	/**
	 * Stores one-off configuration options for the API.
	 */
	config: Record<string, any> = {};

	/**
	 * Add a route to the API.
	 * @param name - The name/key for the route.
	 * @param path - The path or endpoint for the route.
	 */
	addRoute(name: string, path: string) {
		this.routes[name] = path;
	}

	/**
	 * Set a configuration option for the API.
	 * @param key - The configuration key.
	 * @param value - The configuration value.
	 */
	setConfig(key: string, value: any) {
		this.config[key] = value;
	}
}
