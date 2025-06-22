# AWS Testing Framework - Example Project Summary

## What This Project Demonstrates

This example project showcases four different ways to use the [aws-testing-framework](https://www.npmjs.com/package/aws-testing-framework) package for testing AWS serverless architectures:

### 1. Built-in Methods Pattern
**File:** `features/builtin-methods.feature`
**Config:** `cucumber-builtin.js`

Demonstrates using the framework's built-in step definitions directly from the npm package. This is the simplest approach - just import the framework's steps and use them in your feature files.

**Key Benefits:**
- Minimal setup required
- No custom code needed
- Full framework functionality available
- Easy to get started

**Use Case:** When you want to quickly test AWS workflows without writing custom step definitions.

### 2. Custom Steps Pattern
**File:** `features/custom-steps.feature`
**Config:** `cucumber-custom.js`
**Steps:** `src/steps/custom-steps.ts`

Shows how to create your own step definitions with custom business logic while leveraging the framework's core functionality.

**Key Benefits:**
- Custom business logic
- Domain-specific language
- Reusable across projects
- Framework integration

**Use Case:** When you need to test specific business workflows or have custom validation requirements.

### 3. Extend Steps Pattern
**File:** `features/extend-steps.feature`
**Config:** `cucumber-extend.js`
**Steps:** `src/steps/extend-steps.ts`

Demonstrates how to override and extend built-in steps with additional validation, logging, and custom behavior.

**Key Benefits:**
- Enhanced validation
- Custom logging
- Framework extension
- Backward compatibility

**Use Case:** When you want to add custom validation or logging to existing framework steps.

### 4. Feature-only Pattern
**File:** `features/feature-only.feature`
**Config:** `cucumber-feature-only.js`

Shows how to use built-in steps directly in feature files without any custom step definitions.

**Key Benefits:**
- Pure BDD approach
- No custom code
- Framework-driven
- Easy maintenance

**Use Case:** When you want to focus purely on behavior-driven development without custom implementation.

## Project Structure

```
aws-testing-framework-test/
├── features/                    # Cucumber feature files
│   ├── builtin-methods.feature  # Built-in framework usage
│   ├── custom-steps.feature     # Custom business logic
│   ├── extend-steps.feature     # Extended framework steps
│   └── feature-only.feature     # Pure BDD approach
├── src/
│   └── steps/                   # Custom step definitions
│       ├── custom-steps.ts      # Custom business steps
│       ├── extend-steps.ts      # Extended framework steps
│       └── feature-only-steps.ts # Feature-specific steps
├── cucumber-*.js               # Cucumber configurations
├── package.json                # Dependencies and scripts
├── README.md                   # Comprehensive documentation
├── CONTRIBUTING.md             # Contribution guidelines
├── SECURITY.md                 # Security policy
├── LICENSE                     # MIT license
└── GITHUB_SETUP.md            # Repository setup guide
```

## Key Features Demonstrated

### AWS Service Integration
- **S3:** File upload, download, existence checking
- **Lambda:** Function invocation, execution monitoring, log verification
- **Step Functions:** State machine execution, status checking
- **SQS:** Message sending/receiving, queue monitoring
- **CloudWatch:** Log analysis, metrics monitoring

### Framework Capabilities
- **Correlation Tracking:** Follow files through workflows
- **Error Handling:** Comprehensive error detection and reporting
- **Monitoring:** Real-time AWS service monitoring
- **Retry Logic:** Automatic retry with exponential backoff
- **Reporting:** Detailed test reports with HTML output

### Testing Patterns
- **BDD:** Behavior-driven development with Gherkin syntax
- **Integration Testing:** End-to-end AWS workflow testing
- **Error Scenarios:** Testing error conditions and recovery
- **Performance Testing:** Monitoring execution metrics

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure AWS credentials:**
   ```bash
   export AWS_ACCESS_KEY_ID=your-access-key
   export AWS_SECRET_ACCESS_KEY=your-secret-key
   export AWS_REGION=eu-west-2
   ```

3. **Update resource names in feature files:**
   Replace the example resource names with your actual AWS resources:
   - `my-example-bucket` → Your S3 bucket name
   - `my-example-lambda` → Your Lambda function name
   - `my-example-step-function` → Your Step Function name
   - `my-example-queue` → Your SQS queue name

4. **Run examples:**
   ```bash
   # Run all examples
   npm run test:all
   
   # Run specific patterns
   npm run test:builtin
   npm run test:custom-steps
   npm run test:extend-steps
   npm run test:feature-only
   ```

## Customization Guide

### Adding New Usage Patterns

1. **Create feature file:** `features/new-pattern.feature`
2. **Create step definitions:** `src/steps/new-pattern-steps.ts`
3. **Add cucumber config:** `cucumber-new-pattern.js`
4. **Update package.json:** Add test script
5. **Update documentation:** Add to README.md

### Extending Existing Patterns

- **Add new scenarios** to existing feature files
- **Enhance step definitions** with additional validation
- **Create reusable utilities** in `src/` directory
- **Add custom reporting** for specific needs

## Best Practices

### Code Organization
- Keep step definitions focused and single-purpose
- Use descriptive scenario names
- Group related scenarios in feature files
- Maintain consistent naming conventions

### AWS Resource Management
- Use test-specific AWS resources
- Clean up resources after testing
- Use least-privilege IAM permissions
- Monitor AWS costs

### Testing Strategy
- Test happy path scenarios first
- Add error condition testing
- Include performance monitoring
- Use correlation tracking for complex workflows

## Integration with CI/CD

The project includes examples of:
- **GitHub Actions** workflow configuration
- **Test result artifacts** for CI systems
- **Environment-specific** configurations
- **Parallel test execution** support

## Community and Support

- **Documentation:** Comprehensive README and guides
- **Contributing:** Clear contribution guidelines
- **Security:** Responsible disclosure policy
- **Examples:** Multiple usage patterns demonstrated

## Next Steps

1. **Explore the examples** to understand different usage patterns
2. **Customize for your needs** by extending existing patterns
3. **Add your own scenarios** based on your AWS workflows
4. **Contribute back** by sharing new patterns or improvements
5. **Join the community** to learn from others and share experiences

This example project serves as a comprehensive guide for using the AWS Testing Framework effectively in real-world scenarios. 