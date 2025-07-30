# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.3] - 2025-07-30

### Added
- **JavaScript Distribution**: Added compiled JavaScript files for CommonJS and ESM
- **Build Process**: Implemented TypeScript compilation pipeline
- **Dual Package Support**: CommonJS (`dist/index.js`) and ESM (`dist/index.esm.js`) builds
- **Type Declarations**: Generated TypeScript declaration files (`dist/index.d.ts`)
- **Zero-Config JavaScript Usage**: JavaScript users can now import without TypeScript setup

### Changed
- **Package Entry Points**: Updated `main`, `module`, and `types` fields in package.json
- **Export Maps**: Added proper `exports` configuration for dual package support
- **Build Scripts**: Added `build`, `build:clean`, `build:tsc`, `build:esm` scripts
- **Pre-publish Hook**: Added `prepublishOnly` script to ensure builds before publishing
- **Version Bump**: Updated to 0.0.3 for JavaScript compatibility release

### Fixed
- **JavaScript User Experience**: Resolved issue where JavaScript users couldn't import the package
- **Type Export Issues**: Fixed isolated modules TypeScript compilation errors
- **Module Resolution**: Improved package resolution for both Node.js and bundlers

### Technical
- Added TypeScript as dev dependency for build process
- Created `tsconfig.json` for build configuration
- Updated exports to follow Node.js package standards
- Added JavaScript compatibility testing

### Breaking Changes
- None - this is a compatible enhancement that maintains all existing functionality

## [0.0.2] - 2025-07-30

### Changed
- Version bump to test npm registry update and proper version tagging
- Validation of semantic versioning workflow
- Verification of automated release process

### Technical
- Test npm package version synchronization
- Validate git tag and npm registry consistency
- Confirm proper version management workflow

## [0.0.1] - 2025-07-30

### Added
- Initial release of Clean API library
- Core architecture with SOLID principles implementation
- TypeScript support with comprehensive type definitions
- Framework-agnostic API layer solution
- Complete test suite with 100% coverage (129 tests)
- Core components:
  - `API.ts` - API bucket organization system
  - `APIBase.ts` - Route and configuration management
  - `APIClient.ts` - HTTP client abstraction layer
  - `APIError.ts` - Custom error handling class
  - `APITypes.ts` - TypeScript type definitions
- Testing infrastructure with Vitest
- Code quality tools with Biome (formatting and linting)
- Comprehensive documentation:
  - README.md with installation and usage examples
  - CONTRIBUTING.md with development guidelines
  - ROADMAP.md with project direction
  - Test documentation and implementation summary
- GitHub Actions workflow templates
- MIT License

### Developer Experience
- Quick Start section with installation instructions
- Basic usage examples for immediate implementation
- Complete Todo API example demonstrating real-world usage
- Framework examples for React, Vue, Angular, Svelte
- Type-safe API result patterns with `APIResult<T>`
- Error handling best practices
- Testing utilities and mock system

### Technical Features
- Zero external runtime dependencies
- ESM and CommonJS support
- Browser and Node.js compatibility
- Generic type support for type-safe API calls
- Configurable HTTP client swapping
- Route parameter substitution
- Request/response transformation support
- Comprehensive error handling with status codes and data

### Documentation
- Installation instructions for npm, yarn, and pnpm
- Architecture overview and component explanations
- Step-by-step getting started guide
- Advanced usage patterns and best practices
- Complete API reference with TypeScript examples
- Testing strategies and mock implementations
- Contributing guidelines and code of conduct

[unreleased]: https://github.com/BA-CalderonMorales/clean-api/compare/v0.0.3...HEAD
[0.0.3]: https://github.com/BA-CalderonMorales/clean-api/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/BA-CalderonMorales/clean-api/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/BA-CalderonMorales/clean-api/releases/tag/v0.0.1
