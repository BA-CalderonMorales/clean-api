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


# How to use

## Handling API Errors

You can use the `APIError` class to throw and catch errors in a consistent way:

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

# Why is this being made?

There have been quite a few implementations I have seen out there that do this. This is my effort to contribute to a design pattern I've seen has helped me.
Feel free to provide your input. Keep things formal for those who are visiting. 

# Contributions

Willing to work with anyone, in any timezone to make this an easy to extend layer for anyone.
