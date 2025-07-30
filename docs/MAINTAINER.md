# Maintainer Guide

This document provides essential information for developers contributing to or maintaining the Clean API project.

## Project Overview

Clean API is a TypeScript library designed to simplify the API layer in frontend applications. It provides a clean, modular architecture that's framework-agnostic and easily scalable.

## Development Setup

### Prerequisites
- Node.js (latest LTS version recommended)
- npm or yarn package manager

### Installation
```bash
npm install
```

## Code Quality & Formatting

This project uses [Biome](https://biomejs.dev/) for code formatting and linting to ensure consistent code quality across the codebase.

### Available Scripts

#### Format Code
```bash
# Check formatting (shows what would be changed)
npm run format

# Apply formatting changes
npx biome format . --write
```

#### Lint Code
```bash
# Run linter to check for issues
npm run lint

# Run linter and apply auto-fixes where possible
npx biome lint . --apply
```

#### Run Tests
```bash
npm run test
```

### Biome Configuration

The project uses Biome with the following configuration (see `biome.json`):
- **Formatter**: Enabled for consistent code style
- **Linter**: Enabled for code quality checks

### Pre-commit Workflow

Before committing changes, always run:

1. **Format the code**: `npx biome format . --write`
2. **Check for lint issues**: `npm run lint`
3. **Run tests**: `npm run test`

## Architecture Overview

The Clean API library follows a modular architecture with clear separation of concerns:

### Core Components

#### 1. **APITypes.ts** - Type Definitions
- `HTTPMethod`: Supported HTTP methods (GET, POST, PUT, DELETE, PATCH)
- `APIRequest`: Structure for API request configuration
- `APIResponse<T>`: Raw HTTP response representation
- `APIResult<T>`: Ergonomic client result type for error handling

#### 2. **APIBase.ts** - Configuration Layer
- Manages route definitions and API configurations
- Provides methods to add routes and set config options
- Acts as a foundation for API organization

#### 3. **APIClient.ts** - HTTP Client Abstraction
- `APIClient`: Interface for swappable HTTP clients
- `FetchClient`: Default implementation using the Fetch API
- Enables easy testing and client customization

#### 4. **API.ts** - Bucket Organization
- Organizes endpoints into logical buckets (e.g., 'users', 'products')
- Promotes code organization and maintainability

#### 5. **APIError.ts** - Error Handling
- Custom error class with status codes and response data
- Consistent error handling across the library

#### 6. **index.ts** - Public API
- Central export point for all library components
- Defines the public interface consumers will use

### Design Principles

1. **Framework Agnostic**: Works with React, Vue, Angular, Svelte, etc.
2. **Modular**: Each component has a single responsibility
3. **Type Safe**: Full TypeScript support with comprehensive types
4. **Swappable Components**: Easy to customize or replace parts
5. **Ergonomic**: Simple, intuitive API for developers

### Architecture Benefits

- **Scalability**: Easy to add new endpoints and features
- **Testability**: Clear interfaces make mocking and testing simple
- **Maintainability**: Well-organized code with clear separation
- **Flexibility**: Can adapt to different API patterns and requirements

## Contributing Guidelines

### Code Style
- Follow the existing TypeScript conventions
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Ensure all code passes Biome formatting and linting

### Testing
- Write tests for new features and bug fixes
- Ensure all tests pass before submitting PRs
- Follow the existing testing patterns

### Documentation
- Update README.md for user-facing changes
- Update this MAINTAINER.md for internal changes
- Include JSDoc comments for all public APIs

## Release Process

1. Ensure all tests pass
2. Update version in `package.json`
3. Update CHANGELOG.md (if applicable)
4. Create a release tag
5. Publish to npm registry

## Troubleshooting

### Biome Issues
If you encounter Biome formatting or linting issues:

1. Check if your code follows the expected format: `npm run format`
2. Apply formatting fixes: `npx biome format . --write`
3. Check for lint issues: `npm run lint`
4. Apply auto-fixes: `npx biome lint . --apply`

### Common Commands
```bash
# Fix all formatting and linting issues
npx biome format . --write && npx biome lint . --apply

# Full quality check
npm run format && npm run lint && npm run test
```

## Support

For questions or issues:
- Check existing GitHub issues
- Create a new issue with detailed description
- Follow the issue template when available
