# Clean API Test Module

A comprehensive testing framework for the Clean API library, built with **SOLID principles** and **TDD methodology** using Vitest, following the **SPARC architecture pattern**.

## 🏗️ Architecture Overview

The test module follows the SPARC methodology:
- **S**pecification: Clear acceptance criteria and requirements
- **P**seudocode: Detailed testing strategies and breakdowns  
- **A**rchitecture: Well-structured, modular test organization
- **R**efinement: Iterative improvement and optimization
- **C**ompletion: Comprehensive coverage and documentation

## 📁 Directory Structure

```
test/
├── __mocks__/           # Mock implementations
│   ├── fetch.ts         # Fetch API mock with controlled responses
│   └── fixtures.ts      # Test data fixtures and sample data
├── utils/               # Test utilities and helpers
│   ├── testHelpers.ts   # Common test helper functions
│   └── assertions.ts    # Custom Vitest matchers
├── unit/                # Unit tests (mirrors src/ structure)
│   ├── APITypes.test.ts # Type definition tests
│   ├── APIError.test.ts # Error handling tests
│   ├── APIClient.test.ts# HTTP client implementation tests
│   ├── APIBase.test.ts  # Configuration management tests
│   └── API.test.ts      # API bucket organization tests
├── integration/         # Integration tests
│   └── apiWorkflow.test.ts # End-to-end workflow tests
├── setup.ts            # Global test configuration
└── README.md           # This documentation
```

## 🎯 Testing Philosophy

### SOLID Principles Applied

1. **Single Responsibility**: Each test file has a single purpose
2. **Open/Closed**: Tests are extensible without modification
3. **Liskov Substitution**: Mock implementations follow interfaces
4. **Interface Segregation**: Focused test utilities and helpers
5. **Dependency Inversion**: Tests depend on abstractions, not concretions

### Test-Driven Development (TDD)

- **Red**: Write failing tests first
- **Green**: Write minimal code to pass tests
- **Refactor**: Improve code while maintaining test coverage

## 🚀 Getting Started

### Prerequisites

```bash
# Install dependencies
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests once
npm run test:run

# Run with coverage
npm run test:coverage

# Run with UI
npm run test:ui
```

## 📋 Test Categories

### Unit Tests

Test individual components in isolation:

- **APITypes**: Type definitions and interfaces
- **APIError**: Custom error handling and serialization
- **APIClient**: HTTP client abstraction and fetch implementation
- **APIBase**: Route and configuration management
- **API**: Bucket organization and naming

### Integration Tests

Test component interactions and workflows:

- **Complete CRUD operations**
- **Multi-API coordination**
- **Error handling flows**
- **Authentication workflows**
- **RESTful API patterns**
- **Performance scenarios**

## 🛠️ Test Utilities

### Mock System

```typescript
import { mockFetch } from '../__mocks__/fetch';

// Setup mock responses
mockFetch.mockSuccess('/api/users', 'GET', userData);
mockFetch.mockError('/api/users/999', 'GET', 404, { error: 'Not found' });

// Verify requests
const requests = mockFetch.getRequests();
expect(requests).toHaveLength(1);
```

### Test Helpers

```typescript
import { assertAPIResponse, assertAPIError } from '../utils/testHelpers';

// Assert API response structure
assertAPIResponse(response, 200, true);

// Assert API error properties
assertAPIError(error, 'Expected message', 404);
```

### Custom Assertions

```typescript
// Custom Vitest matchers
expect(response).toBeValidAPIResponse();
expect(result).toBeValidAPIResult();
expect(method).toBeValidHTTPMethod();
```

## 🎯 Coverage Goals

- **Branches**: 80%+
- **Functions**: 80%+
- **Lines**: 80%+
- **Statements**: 80%+

## 🧪 Testing Patterns

### Arrangement-Act-Assert (AAA)

```typescript
it('should handle user creation', async () => {
  // Arrange
  const userData = { name: 'John', email: 'john@example.com' };
  mockFetch.mockSuccess('/api/users', 'POST', { id: 1, ...userData });
  
  // Act
  const result = await client.request({
    url: '/api/users',
    method: 'POST',
    data: userData,
  });
  
  // Assert
  expect(result.id).toBe(1);
  expect(result.name).toBe('John');
});
```

### Test Fixtures

```typescript
import { sampleUser, sampleProduct } from '../__mocks__/fixtures';

// Use predefined test data
mockFetch.mockSuccess('/api/users/1', 'GET', sampleUser);
```

### Error Testing

```typescript
it('should handle API errors gracefully', async () => {
  mockFetch.mockError('/api/users/999', 'GET', 404, { error: 'User not found' });
  
  const result = await client.request({
    url: '/api/users/999',
    method: 'GET',
  });
  
  expect(result.error).toBe('User not found');
});
```

## 🔧 Configuration

### Vitest Configuration

- **Environment**: jsdom (for DOM APIs)
- **Globals**: Enabled for describe/it/expect
- **Setup**: Automatic mock clearing and environment reset
- **Coverage**: V8 provider with HTML/LCOV reports

### TypeScript Support

Full TypeScript support with:
- Type checking during tests
- Generic type testing
- Interface compliance verification

## 📊 Best Practices

### Test Organization

1. **Mirror source structure** in unit tests
2. **Group related functionality** in describe blocks
3. **Use descriptive test names** that explain behavior
4. **Isolate tests** with proper setup/teardown

### Mock Management

1. **Reset mocks** between tests
2. **Use fixtures** for consistent test data
3. **Mock external dependencies** (fetch, timers, etc.)
4. **Verify mock interactions** when relevant

### Assertion Strategies

1. **Assert behavior**, not implementation
2. **Use specific assertions** over generic ones
3. **Test both happy and error paths**
4. **Verify side effects** and state changes

## 🚨 Troubleshooting

### Common Issues

1. **Mock not working**: Ensure `mockFetch.reset()` is called in beforeEach
2. **Type errors**: Check import paths and type definitions
3. **Async test failures**: Ensure proper await/Promise handling
4. **Coverage gaps**: Review test completeness and edge cases

### Debug Tips

```typescript
// Debug mock interactions
console.log(mockFetch.getRequests());

// Debug test state
console.log(JSON.stringify(result, null, 2));

// Use Vitest debugging
debugger; // Works with --inspect flag
```

## 🔄 Continuous Integration

Tests run automatically on:
- Pull requests
- Main branch pushes
- Release preparations

Coverage reports are generated and tracked over time.

## 📈 Metrics and Monitoring

- **Test execution time**: Monitored for performance
- **Coverage trends**: Tracked for regression detection
- **Flaky test detection**: Automated identification
- **Test reliability**: Success rate monitoring

## 🤝 Contributing

When adding new features:

1. **Write tests first** (TDD approach)
2. **Follow naming conventions**
3. **Update fixtures** if needed
4. **Maintain coverage thresholds**
5. **Document complex test scenarios**

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)
- [TDD Principles](https://www.agilealliance.org/glossary/tdd/)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

Built with ❤️ following SPARC methodology and Clean Architecture principles.
