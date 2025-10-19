# AWS Testing Framework - Example Usage

This repository demonstrates how to use the [aws-testing-framework](https://www.npmjs.com/package/aws-testing-framework) package with different usage patterns for testing AWS serverless architectures.

> **📦 Framework Version:** This project uses `aws-testing-framework` v0.6.1 (upgraded from v0.2.0)
> 
> **🔄 Breaking Changes:** Version 0.6.1 introduced significant API changes including:
> - Simplified initialization with dependency injection
> - Step definitions now registered through a single support file
> - Methods moved from framework to respective service classes
> - `waitForCondition` moved to `HealthValidator` service

## Overview

The `aws-testing-framework` is a BDD testing framework for AWS services and their interactions. This example project shows four different ways to use the framework:

1. **Built-in Methods** - Use framework's built-in step definitions directly
2. **Custom Steps** - Create your own step definitions with business logic
3. **Extend Steps** - Override and extend built-in steps with custom validation
4. **Feature-only** - Use built-in steps directly in feature files

## Prerequisites

- Node.js 20.16.0+ 
- AWS CLI configured with appropriate permissions
- AWS resources deployed (S3 bucket, Lambda function, Step Function, SQS queue)

## Installation

```bash
npm install
```

This will install the `aws-testing-framework` package and all required dependencies.

## Usage Patterns

### 1. Built-in Methods Pattern

Use the framework's built-in step definitions directly from the npm package.

**Configuration:** `cucumber-builtin.js`
```javascript
module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'features/step_definitions/framework-support.ts'
    ],
    format: ['progress', 'html:reports/cucumber-report.html'],
    formatOptions: { snippetInterface: 'async-await' },
    paths: ['features/builtin-methods.feature']
  }
};
```

The framework now uses a simplified setup with a single support file that initializes all built-in step definitions using dependency injection.

**Run tests:**
```bash
npm run test:builtin
```

**Example feature:**
```gherkin
Feature: Using Built-in Framework Methods
  Background:
    Given I have an S3 bucket named "my-bucket"
    And I have a Lambda function named "my-lambda"
    And I have a Step Function named "my-step-function"

  Scenario: Test S3 to Lambda workflow
    When I upload a file "test-data.json" with content '{"key": "value"}' to the S3 bucket
    Then the Lambda function should be invoked
    And the Lambda function should process the exact file "test-data.json"
```

### 2. Custom Steps Pattern

Create your own step definitions with custom business logic.

**Configuration:** `cucumber-custom.js`
```javascript
module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'src/steps/custom-steps.ts'
    ],
    format: ['progress', 'html:reports/cucumber-report.html'],
    formatOptions: { snippetInterface: 'async-await' },
    paths: ['features/custom-steps.feature']
  }
};
```

**Run tests:**
```bash
npm run test:custom-steps
```

**Example feature:**
```gherkin
Feature: Custom Business Logic Testing
  Background:
    Given I have a data processing pipeline with bucket "my-bucket"
    And I have a data processor Lambda named "my-lambda"
    And I have a notification system with SQS queue "my-queue"

  Scenario: Test custom notification workflow
    When I trigger a notification event for user "john.doe@example.com"
    Then a notification message should be sent to the SQS queue
    And the message should contain the user's email address
    And the message should have the correct priority level
```

### 3. Extend Steps Pattern

Override and extend built-in steps with custom validation and logging.

**Configuration:** `cucumber-extend.js`
```javascript
module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'src/steps/extend-steps.ts'
    ],
    format: ['progress', 'html:reports/cucumber-report.html'],
    formatOptions: { snippetInterface: 'async-await' },
    paths: ['features/extend-steps.feature']
  }
};
```

**Run tests:**
```bash
npm run test:extend-steps
```

**Example feature:**
```gherkin
Feature: Extended Framework Testing
  Background:
    Given I have an S3 bucket named "my-bucket"
    And I have a Lambda function named "my-lambda"
    And I have a Step Function named "my-step-function"

  Scenario: Test extended S3 upload with custom validation
    When I upload a file "extended-test.json" with content '{"extended": "test"}' to the S3 bucket
    Then the file should be uploaded with enhanced metadata
    And the file should be validated against custom business rules
    And the Lambda function should be invoked with extended context
```

### 4. Feature-only Pattern

Use built-in steps directly in feature files without custom step definitions.

**Configuration:** `cucumber-feature-only.js`
```javascript
module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'features/step_definitions/framework-support.ts',
      'src/steps/feature-only-steps.ts'
    ],
    format: ['progress', 'html:reports/cucumber-report.html'],
    formatOptions: { snippetInterface: 'async-await' },
    paths: ['features/feature-only.feature']
  }
};
```

**Run tests:**
```bash
npm run test:feature-only
```

## Available Test Scripts

```bash
# Run all tests
npm run test:all

# Run specific usage patterns
npm run test:builtin        # Built-in methods pattern
npm run test:custom-steps   # Custom steps pattern
npm run test:extend-steps   # Extend steps pattern
npm run test:feature-only   # Feature-only pattern

# Build and clean
npm run build
npm run clean

# Allure Reports (requires Java)
npm run allure:generate     # Generate Allure HTML report
npm run allure:open         # Open generated report in browser
npm run allure:serve        # Generate and serve report (opens automatically)
npm run test:allure         # Run tests and open report
```

## Allure Reporting

This project includes [Allure Report](https://allurereport.org/docs/cucumberjs/) integration for beautiful, interactive test reports.

### Prerequisites

Allure requires **Java** to be installed. Install it using:

**macOS:**
```bash
brew install openjdk
```

**Linux:**
```bash
sudo apt-get install openjdk-11-jre
```

**Windows:**
Download from [java.com](https://www.java.com)

### Viewing Reports

After running tests, Allure results are automatically saved to `allure-results/`.

**Option 1: Quick serve (generates and opens automatically)**
```bash
npm run allure:serve
```

**Option 2: Generate static HTML report**
```bash
npm run allure:generate
npm run allure:open
```

### Report Features

Allure reports include:
- ✅ Test execution history and trends
- ✅ Test duration and performance metrics  
- ✅ Detailed step-by-step execution
- ✅ Categories for passed/failed/skipped tests
- ✅ Timeline view of test execution
- ✅ Beautiful, shareable HTML reports

## Project Structure

```
aws-testing-framework-test/
├── features/                    # Cucumber feature files
│   ├── builtin-methods.feature
│   ├── custom-steps.feature
│   ├── extend-steps.feature
│   └── feature-only.feature
├── src/
│   └── steps/                  # Custom step definitions
│       ├── custom-steps.ts
│       ├── extend-steps.ts
│       └── feature-only-steps.ts
├── cucumber-*.js              # Cucumber configurations
├── package.json
└── README.md
```

## Configuration

### AWS Resources

Update the feature files with your actual AWS resource names:

- **S3 Bucket:** `my-example-bucket`
- **Lambda Function:** `my-example-lambda`
- **Step Function:** `my-example-step-function`
- **SQS Queue:** `my-example-queue`

### Environment Variables

Ensure your AWS credentials are configured:

```bash
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_REGION=eu-west-2
```

## Key Concepts

### Step Context

The framework provides a `StepContext` that persists data between steps:

```typescript
interface StepContext {
  bucketName?: string;
  functionName?: string;
  stateMachineName?: string;
  correlationId?: string;
  // ... other properties
}
```

### Correlation Tracking

The framework automatically tracks files through your AWS workflow using correlation IDs:

```typescript
// Upload with correlation tracking
await framework.uploadFileWithTracking(
  bucketName,
  fileName,
  content,
  correlationId
);

// Trace through workflow
const trace = await framework.traceFileThroughWorkflow(fileName, correlationId);
```

### Built-in Steps

The framework provides many built-in steps for common AWS operations:

- **S3:** Upload, download, check existence
- **Lambda:** Invoke, check execution, monitor logs
- **Step Functions:** Execute, check status, monitor states
- **SQS:** Send/receive messages, check queue status
- **Monitoring:** Log verification, metrics, error checking

## Contributing

This is an example project demonstrating the `aws-testing-framework`. For framework contributions, please visit the [main repository](https://github.com/sophiegle/aws-testing-framework).

## License

MIT License - see [LICENSE](LICENSE) file for details. 