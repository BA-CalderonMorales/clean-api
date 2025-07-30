# Clean API

Don't over-think the API layer in frontend code. Leverage this package to easily scale your projects.

# Architecture


```
API.ts - Provides a way to keep APIs structured to a particular bucket.
APIBase.ts - Provides a layer to which you can add routes and one-off configurations.
APIClient.ts - Provides a layer to which you can swap out clients at any point.
APITypes.ts - Provides an easy way to tap into the types for this library.
APIError.ts - Custom error class for handling API-related errors safely and consistently.
```

# Getting Started

## Adding API Buckets

<details>

<summary>You can organize your API endpoints into buckets using the `API` class:</summary>

```typescript

import { API } from 'clean-api';

const userAPI = new API('users');
const productAPI = new API('products');

```

</details>

## Adding Routes and Configurations

<details>

<summary>Use the <code>APIBase</code> class to add routes and custom configurations:</summary>

```typescript

import { APIBase } from 'clean-api';

const apiBase = new APIBase();

apiBase.addRoute('getUser', '/users/:id');
apiBase.setConfig('timeout', 5000);

console.log(apiBase.routes); // { getUser: '/users/:id' }
console.log(apiBase.config); // { timeout: 5000 }

```

</details>


## Handling API Errors

<details>

<summary>You can use the <code>APIError</code> class to throw and catch errors in a consistent way:</summary>

```typescript

import { APIError } from 'clean-api';

try {

    // ... your API call logic
    throw new APIError('Request failed', { status: 404, data: { message: 'Not found' } });

} catch (error) {

    if (error instanceof APIError) {
        console.error('API error:', error.status, error.data);
    } else {
        // handle other errors
    }

}

```

</details>


## Complete Example

<details>

<summary>How to create a type-safe, ergonomic API layer:</summary>

```typescript

import { APIBase, APIError, HTTPMethod, APIResult } from 'clean-api';

// Define the shape of a Todo item
type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

// Define the shape of the request options
type RequestOptions = {
  url: string;
  method: string;
  data?: any;
};

// APIResult<T> is a generic type for API client results, exported from the library.
// Use this as the return type for your API client methods.
// It allows you to write: const { data, error } = await api.someMethod();
// This is different from APIResponse, which represents the raw HTTP response with status and data.

// 1. Encapsulate your HTTP client logic in a class
class CustomFetchClient {

    /**
     * ## APIResult vs APIResponse
     *
     * - Use `APIResult<T>` as the return type for your API client methods. This makes it easy to get either the data or the error from an API call.
     * - Use `APIResponse<T>` to represent the actual HTTP response from the server, which includes both the status code and the data.
     *
     * Example:
     * ```typescript
     * // Ergonomic usage
     * const { data, error } = await todosAPI.getTodos();
     *
     * // Raw HTTP response
     * const response: APIResponse<Todo[]> = await fetch(...);
     * console.log(response.status, response.data);
     * ```
     */
    async request<T = any>({ url, method, data }: RequestOptions): APIResult<T> {

      try {

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: data ? JSON.stringify(data) : undefined,
        });

        const result = await response.json();

        return { data: result };

      } catch (err: any) {

        return { error: new APIError('API call failed', { status: err.status, data: err.data }) };

      }

    }
}

// 2. Create a class for your API endpoints, using the client
class TodosAPI {

  private client: CustomFetchClient;
  private routes: Record<string, string>;

  constructor(client: CustomFetchClient, routes: Record<string, string>) {

    this.client = client;
    this.routes = routes;

  }

  getTodos() {

    return this.client.request<Todo[]>({

        url: this.routes.getTodos,
        method: 'GET'

    });

  }

  createTodo(data: Omit<Todo, 'id'>) {

    return this.client.request<Todo>({

      url: this.routes.createTodo,
      method: 'POST',
      data

    });

  }

  updateTodo(id: string, data: Partial<Omit<Todo, 'id'>>) {

    return this.client.request<Todo>({

      url: this.routes.updateTodo.replace(':id', id),
      method: 'PUT',
      data

    });

  }

  patchTodo(id: string, data: Partial<Omit<Todo, 'id'>>) {

    return this.client.request<Todo>({

      url: this.routes.updateTodo.replace(':id', id),
      method: 'PATCH',
      data

    });

  }

  deleteTodo(id: string) {

    return this.client.request<{ success: boolean }>({

      url: this.routes.deleteTodo.replace(':id', id),
      method: 'DELETE'

    });

  }
}

// 3. Set up your APIBase and client
const base = new APIBase();

base.addRoute('getTodos', '/todos');
base.addRoute('createTodo', '/todos');
base.addRoute('updateTodo', '/todos/:id');
base.addRoute('deleteTodo', '/todos/:id');

const client = new CustomFetchClient();
const todosAPI = new TodosAPI(client, base.routes);

// 4. Example usage: clear and type-safe
async function runExamples() {

  const { data: todos, error: getError } = await todosAPI.getTodos();

  if (getError instanceof APIError) {

    console.error('Get todos failed:', getError.message, getError.status);

  } else {

    console.log('Todos:', todos);

  }

  const { data: created, error: createError } = await todosAPI.createTodo({ title: 'New Todo' });
  
  if (createError instanceof APIError) {

    console.error('Create todo failed:', createError.message, createError.status);

  } else {

    console.log('Created:', created);

  }

  const { data: updated, error: updateError } = await todosAPI.updateTodo('1', { title: 'Updated Todo' });
  
  if (updateError instanceof APIError) {

    console.error('Update todo failed:', updateError.message, updateError.status);

  } else {

    console.log('Updated:', updated);

  }

  const { data: patched, error: patchError } = await todosAPI.patchTodo('1', { completed: true });
  
  if (patchError instanceof APIError) {

    console.error('Patch todo failed:', patchError.message, patchError.status);

  } else {

    console.log('Patched:', patched);

  }

  const { data: deleted, error: deleteError } = await todosAPI.deleteTodo('1');
  
  if (deleteError instanceof APIError) {

    console.error('Delete todo failed:', deleteError.message, deleteError.status);

  } else {

    console.log('Deleted:', deleted);

  }
}

runExamples();
```

</details>

---

# Motivation and Benefits

This pattern is designed to bring clarity, scalability, and maintainability to the API layer in frontend applications. By organizing endpoints into logical buckets and providing clear abstractions for routes, clients, and error handling, it enables teams to:

- **Scale easily**: Add new endpoints or swap out HTTP clients with minimal changes.
- **Maintain consistency**: Enforce a uniform structure for API interactions across the codebase.
- **Enhance type safety**: Leverage TypeScript types for safer, more predictable API usage.
- **Improve testability**: Isolate API logic for easier unit testing and mocking.
- **Reduce boilerplate**: Avoid repetitive code by centralizing configuration and error handling.

This approach is inspired by proven patterns in large-scale applications and aims to empower teams to build robust, flexible API layers that grow with their projects.

# Author's Perspective

Over the years, I have encountered various approaches to structuring API layers in frontend projects. This library reflects a design pattern that has consistently proven effective in my experience. I welcome feedback and suggestions to further improve this solution and encourage a collaborative, professional environment for all contributors.

# Contributions

Contributions are welcome from anyone, regardless of timezone. The goal is to make this API layer easy to extend and accessible to all.
