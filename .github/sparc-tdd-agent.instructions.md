# Clean API - AI Agent Instructions

This file provides specific instructions for AI agents working on the Clean API project.

## Project Overview

Clean API is a TypeScript library that simplifies API layer management in frontend applications. It follows clean architecture principles with modular, framework-agnostic design.

## Architecture Guidelines

### Core Principles
- **Framework Agnostic**: Must work with React, Vue, Angular, Svelte, etc.
- **Type Safety**: Full TypeScript support with comprehensive types
- **Modular Design**: Each component has a single, clear responsibility
- **Swappable Components**: Easy to customize or replace parts
- **Ergonomic API**: Simple, intuitive interface for developers

### File Structure & Responsibilities
```
src/
├── APITypes.ts      # Type definitions (HTTPMethod, APIRequest, APIResponse, APIResult)
├── APIBase.ts       # Configuration layer (routes, config management)
├── APIClient.ts     # HTTP client abstraction (interface + Fetch implementation)
├── API.ts           # Bucket organization for endpoints
├── APIError.ts      # Custom error handling with status codes
└── index.ts         # Public API exports
```

## Development Standards

### Code Quality
- **Formatter**: Use Biome for consistent formatting
- **Linter**: Use Biome for code quality checks
- **Testing**: Use Vitest for unit testing
- **Documentation**: JSDoc comments for all public APIs

### Required Commands Before Committing
```bash
npx biome format . --write && npm run lint && npm run test
```

### TypeScript Standards
- Use strict TypeScript configuration
- Provide generic types for flexibility (`APIResponse<T>`, `APIResult<T>`)
- Export all public interfaces and types
- Use meaningful interface names that describe their purpose

### Testing Requirements
- Write tests for all new features and bug fixes
- Follow existing test patterns in the codebase
- Use Vitest testing framework
- Place test files alongside source files with `.test.ts` extension
- Ensure all tests pass before submitting changes

## TDD Agent Specific Instructions

### When Implementing New Features
1. **Analyze existing architecture** before making changes
2. **Follow the modular pattern** - each file has a specific purpose
3. **Maintain backward compatibility** unless it's a major version change
4. **Add comprehensive TypeScript types** for all new functionality
5. **Write tests first** following TDD principles
6. **Update documentation** including JSDoc comments

### Error Handling Patterns
- Use `APIError` class for all API-related errors
- Include status codes and response data when available
- Follow the `APIResult<T>` pattern for ergonomic error handling
- Prefer `{ data?, error? }` return pattern for client methods

### Type Safety Requirements
- All public methods must have proper TypeScript types
- Use generics where appropriate for flexibility
- Export types that consumers might need
- Avoid `any` types - use proper generic constraints

### Testing Patterns
```typescript
import { describe, it, expect } from 'vitest';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should handle expected behavior', () => {
    // Arrange
    const instance = new ComponentName();
    
    // Act
    const result = instance.method();
    
    // Assert
    expect(result).toBe(expectedValue);
  });
});
```

### Commit Message Format
Follow semantic commit conventions:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `test:` - Test additions or updates
- `refactor:` - Code refactoring without feature changes
- `style:` - Code style/formatting changes

### Breaking Change Guidelines
- Only introduce breaking changes in major versions
- Document all breaking changes in commit messages
- Use `BREAKING CHANGE:` in commit body for major changes
- Consider deprecation warnings before removing functionality

## Code Review Checklist

When implementing changes, ensure:
- [ ] Code follows existing architectural patterns
- [ ] All new code has comprehensive TypeScript types
- [ ] Tests are written and passing
- [ ] Code is formatted with Biome
- [ ] JSDoc comments are added for public APIs
- [ ] No breaking changes without version bump
- [ ] Backward compatibility is maintained
- [ ] Error handling follows established patterns

## Common Patterns to Follow

### API Client Implementation
```typescript
export class NewClient implements APIClient {
  async request<T = any>(options: RequestOptions): Promise<T> {
    // Implementation with proper error handling
  }
}
```

### Type Definitions
```typescript
export interface NewFeature {
  /** Description of property */
  property: string;
}

export type NewResult<T> = Promise<{ data?: T; error?: Error }>;
```

### Error Handling
```typescript
try {
  const result = await apiCall();
  return { data: result };
} catch (error) {
  return { error: new APIError('Operation failed', { status: error.status }) };
}
```

## Files to Never Modify Directly
- `package.json` version - use `npm version` commands
- `biome.json` - only modify with team consensus
- `index.ts` - only add exports for new public APIs

## Testing Strategy
- Unit tests for all components
- Integration tests for client implementations
- Mock external dependencies
- Test both success and error scenarios
- Ensure type safety in tests

## Documentation Requirements
- Update README.md for user-facing changes
- Update MAINTAINER.md for architecture changes
- Add JSDoc comments with examples for complex APIs
- Keep QUICK_START.md updated with essential commands

## Performance Considerations
- Keep bundle size minimal
- Avoid unnecessary dependencies
- Use tree-shaking friendly exports
- Consider lazy loading for optional features

## Security Guidelines
- Validate input parameters
- Handle sensitive data appropriately
- Follow secure coding practices for HTTP clients
- Avoid logging sensitive information
