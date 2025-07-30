# Quick Start Guide

Get up and running with Clean API development in under 5 minutes.

## Setup

```bash
npm install
```

## Essential Commands

### Testing (Vitest)
```bash
# Run tests
npm run test

# Watch mode
npm test -- --watch
```

### Code Formatting (Biome)
```bash
# Check formatting
npm run format

# Apply formatting
npx biome format . --write

# Fix linting issues
npx biome lint . --apply
```

### Quality Check Pipeline
```bash
# Run everything before committing
npx biome format . --write && npm run lint && npm run test
```

## Semantic Versioning

Follow [SemVer](https://semver.org/) conventions:

- **PATCH** (0.0.X): Bug fixes
- **MINOR** (0.X.0): New features (backward compatible)
- **MAJOR** (X.0.0): Breaking changes

```bash
# Update version
npm version patch|minor|major
```

## Development Workflow

1. Make changes
2. Format: `npx biome format . --write`
3. Test: `npm run test`
4. Commit: `git commit -m "feat: description"`

## Commit Message Format

```bash
feat: add new feature
fix: resolve bug
docs: update documentation
```

## Need More Details?

- **Architecture & Setup**: [MAINTAINER.md](./MAINTAINER.md)
- **Usage Examples**: [README.md](../README.md)
