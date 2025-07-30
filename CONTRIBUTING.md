# Contributing to Clean API

Thank you for your interest in contributing to Clean API! We welcome contributions from developers of all experience levels and backgrounds, regardless of timezone. This document provides guidelines to help you contribute effectively to our project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Submitting Changes](#submitting-changes)
- [Issue Guidelines](#issue-guidelines)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)
- [Community](#community)

## 🤝 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. We expect all participants to:

- **Be respectful**: Treat all community members with respect and kindness
- **Be collaborative**: Work together constructively and help others learn
- **Be inclusive**: Welcome newcomers and encourage diverse perspectives
- **Be professional**: Maintain a professional tone in all interactions
- **Be patient**: Remember that everyone has different experience levels

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Latest LTS version recommended
- **npm**: Package manager (comes with Node.js)
- **Git**: Version control system
- **TypeScript**: Knowledge of TypeScript is helpful but not required

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/clean-api.git
   cd clean-api
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Verify Your Setup

Run the test suite to ensure everything is working:

```bash
npm test
```

All tests should pass with 100% coverage maintained.

## 🔄 Development Workflow

### Branch Naming Convention

Use descriptive branch names with prefixes:

- `feature/` - New features or enhancements
- `bugfix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test improvements
- `chore/` - Maintenance tasks

Examples:
- `feature/add-retry-mechanism`
- `bugfix/fix-header-encoding`
- `docs/improve-readme-examples`

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting changes (no code logic changes)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(client): add request timeout configuration
fix(error): handle network errors properly
docs(readme): update installation instructions
test(api): add integration tests for CRUD operations
```

## 📏 Coding Standards

### Code Quality Tools

This project uses [Biome](https://biomejs.dev/) for code formatting and linting:

```bash
# Check and fix formatting
npm run format

# Check and fix linting issues
npm run lint
```

### TypeScript Guidelines

- **Use strict TypeScript**: Enable strict mode for type safety
- **Explicit types**: Provide explicit return types for functions
- **Generic constraints**: Use proper generic constraints when needed
- **Interface over type**: Prefer interfaces for object shapes
- **Meaningful names**: Use descriptive variable and function names

### Architecture Principles

This project follows **SOLID principles** and **clean architecture**:

1. **Single Responsibility**: Each class/function has one reason to change
2. **Open/Closed**: Open for extension, closed for modification
3. **Liskov Substitution**: Subtypes must be substitutable for base types
4. **Interface Segregation**: Depend on abstractions, not concretions
5. **Dependency Inversion**: High-level modules shouldn't depend on low-level modules

### File Organization

- **Core logic**: `/src` directory
- **Tests**: `/test` directory with matching structure
- **Documentation**: `/docs` directory
- **Configuration**: Root level config files

## 🧪 Testing Guidelines

### Test Requirements

- **100% coverage**: Maintain 100% test coverage for core source files
- **Test all scenarios**: Include happy paths, error cases, and edge cases
- **Integration tests**: Add integration tests for complex workflows
- **Type safety**: Ensure tests are type-safe

### Test Structure

Follow the **AAA pattern** (Arrange, Act, Assert):

```typescript
describe('Component', () => {
  it('should do something when condition is met', () => {
    // Arrange
    const input = 'test data';
    const expected = 'expected result';
    
    // Act
    const result = functionUnderTest(input);
    
    // Assert
    expect(result).toBe(expected);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Mock Guidelines

- Use mocks for external dependencies
- Keep mocks simple and focused
- Reset mocks between tests
- Verify mock interactions when relevant

## 📤 Submitting Changes

### Before Submitting

1. **Run tests**: Ensure all tests pass
   ```bash
   npm test
   ```

2. **Check formatting**: Ensure code is properly formatted
   ```bash
   npm run format
   npm run lint
   ```

3. **Update documentation**: Update relevant documentation
4. **Add tests**: Include tests for new functionality
5. **Update coverage**: Maintain 100% test coverage

### Pull Request Checklist

- [ ] Tests pass locally
- [ ] Code is formatted and linted
- [ ] Documentation is updated
- [ ] Commit messages follow conventional format
- [ ] PR description explains the change
- [ ] Breaking changes are documented
- [ ] Coverage remains at 100%

## 🐛 Issue Guidelines

### Bug Reports

When reporting bugs, please include:

- **Clear description**: What happened vs. what was expected
- **Steps to reproduce**: Minimal steps to reproduce the issue
- **Environment**: OS, Node.js version, package version
- **Code example**: Minimal code example demonstrating the issue
- **Error messages**: Full error messages and stack traces

### Feature Requests

When requesting features, please include:

- **Use case**: Why is this feature needed?
- **Proposed solution**: How should it work?
- **Alternatives**: What alternatives have you considered?
- **Breaking changes**: Would this introduce breaking changes?

### Enhancement Ideas

- **Background**: Context and motivation
- **Proposal**: Detailed description of the enhancement
- **Implementation**: Rough implementation approach
- **Impact**: How this would affect existing users

## 🔄 Pull Request Process

### 1. Create Your PR

- Use a descriptive title
- Reference related issues using `#issue-number`
- Provide a clear description of changes
- Include screenshots for UI changes (if applicable)

### 2. PR Review Process

- **Automated checks**: All CI checks must pass
- **Code review**: At least one maintainer review required
- **Testing**: Reviewer may test changes locally
- **Documentation**: Ensure documentation is adequate

### 3. Addressing Feedback

- Respond to all review comments
- Make requested changes promptly
- Ask questions if feedback is unclear
- Mark conversations as resolved when addressed

### 4. Merging

- **Squash and merge**: We use squash and merge for clean history
- **Delete branch**: Source branch will be deleted after merge
- **Release notes**: Significant changes will be included in release notes

## 🚀 Release Process

### Versioning

We follow [Semantic Versioning (SemVer)](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Workflow

1. **Prepare release**: Update version, changelog, and documentation
2. **Create release**: Tag and create GitHub release
3. **Publish package**: Publish to npm registry
4. **Announce**: Communicate release to community

## 💬 Community

### Getting Help

- **Issues**: Use GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub discussions for questions and ideas
- **Documentation**: Check existing documentation first

### Contributing Areas

We welcome contributions in these areas:

- **Core functionality**: API layer improvements
- **Documentation**: Examples, guides, and API docs
- **Testing**: Additional test cases and test utilities
- **Performance**: Optimization and benchmarking
- **Developer experience**: Tooling and workflow improvements

### Recognition

We recognize contributors by:

- **Contributor list**: All contributors are listed in the README
- **Release notes**: Significant contributions are highlighted
- **Maintainer status**: Active contributors may become maintainers

## 📚 Resources

### Project Resources

- **Repository**: [GitHub Repository](https://github.com/BA-CalderonMorales/clean-api)
- **Issues**: [Issue Tracker](https://github.com/BA-CalderonMorales/clean-api/issues)
- **Documentation**: See `/docs` directory
- **Test Documentation**: See `test/README.md`

### External Resources

- **TypeScript**: [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- **Vitest**: [Vitest Documentation](https://vitest.dev/)
- **Biome**: [Biome Documentation](https://biomejs.dev/)
- **Conventional Commits**: [Conventional Commits Specification](https://www.conventionalcommits.org/)

## 🎯 Project Goals

Our primary goals are to:

1. **Simplify API layers**: Make frontend API code more maintainable
2. **Promote best practices**: Encourage clean architecture patterns
3. **Ensure type safety**: Leverage TypeScript for better DX
4. **Stay framework agnostic**: Work with any frontend framework
5. **Maintain quality**: Keep high code quality and test coverage

## 📞 Contact

- **Maintainer**: Brandon A. Calderon-Morales
- **Email**: Use GitHub issues for project-related questions
- **Response time**: We aim to respond within 48 hours

---

Thank you for contributing to Clean API! Your contributions help make this project better for everyone. We appreciate your time and effort in improving the API layer experience for frontend developers worldwide.

**Happy coding!** 🚀
