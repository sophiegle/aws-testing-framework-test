# Contributing to AWS Testing Framework Examples

Thank you for your interest in contributing to the AWS Testing Framework examples! This repository demonstrates different usage patterns for the [aws-testing-framework](https://www.npmjs.com/package/aws-testing-framework) package.

## How to Contribute

### 1. Adding New Usage Patterns

If you have a new way to use the framework, we'd love to see it! Here's how to add a new usage pattern:

1. **Create a new feature file** in the `features/` directory
2. **Create corresponding step definitions** in `src/steps/`
3. **Add a cucumber configuration** file (e.g., `cucumber-new-pattern.js`)
4. **Update package.json** with a new test script
5. **Update this README** to document the new pattern

### 2. Improving Existing Examples

- **Enhance step definitions** with better error handling
- **Add more comprehensive test scenarios**
- **Improve documentation** and comments
- **Fix bugs** or edge cases

### 3. Documentation Improvements

- **Update README.md** with clearer explanations
- **Add code comments** for complex scenarios
- **Create additional documentation** for advanced use cases

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sophiegle/aws-testing-framework-test.git
   cd aws-testing-framework-test
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure AWS credentials:**
   ```bash
   export AWS_ACCESS_KEY_ID=your-access-key
   export AWS_SECRET_ACCESS_KEY=your-secret-key
   export AWS_REGION=your-region
   ```

4. **Run tests:**
   ```bash
   npm run test:all
   ```

## Code Style Guidelines

### TypeScript
- Use TypeScript for all step definitions
- Follow standard TypeScript conventions
- Add proper type annotations
- Use async/await for asynchronous operations

### Cucumber Features
- Use descriptive scenario names
- Follow Gherkin best practices
- Include Background sections for common setup
- Use data tables when appropriate

### Step Definitions
- Keep steps focused and single-purpose
- Add meaningful error messages
- Use the framework's StepContext for data sharing
- Add logging for debugging purposes

## Testing Your Changes

Before submitting a pull request:

1. **Run all tests:**
   ```bash
   npm run test:all
   ```

2. **Test individual patterns:**
   ```bash
   npm run test:builtin
   npm run test:custom-steps
   npm run test:extend-steps
   npm run test:feature-only
   ```

3. **Verify documentation:**
   - Check that README.md is up to date
   - Ensure code examples are accurate
   - Verify all links work

## Pull Request Process

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Test thoroughly**
5. **Update documentation**
6. **Submit a pull request**

### Pull Request Guidelines

- **Clear title** describing the change
- **Detailed description** of what was changed and why
- **Screenshots** if UI changes are involved
- **Test results** showing all tests pass
- **Reference related issues** if applicable

## Issue Reporting

When reporting issues:

1. **Use the issue template** if available
2. **Provide clear steps** to reproduce the problem
3. **Include error messages** and stack traces
4. **Specify your environment** (Node.js version, AWS region, etc.)
5. **Add relevant logs** or screenshots

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct/). By participating, you are expected to uphold this code.

## Questions?

If you have questions about contributing:

- **Open an issue** for general questions
- **Start a discussion** for design decisions
- **Check existing issues** for similar questions

Thank you for contributing to making the AWS Testing Framework examples better for everyone! 