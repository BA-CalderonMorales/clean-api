/**
 * Entry point for the Clean API library.
 *
 * This file re-exports all main modules, providing a single import path for consumers.
 *
 * Example usage:
 *   import { API, APIBase, APIClient, FetchClient, APIRequest, APIResponse } from '@ba-calderonmorales/clean-api';
 */
export { API } from "./API";
export { APIBase } from "./APIBase";
export { FetchClient } from "./APIClient";
export { APIError } from "./APIError";

// Type-only exports
export type { APIClient } from "./APIClient";
export type { HTTPMethod, APIRequest, APIResponse, APIResult } from "./APITypes";
