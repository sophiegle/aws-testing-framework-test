# Migration Guide: aws-testing-framework v0.2.0 → v0.6.1

This guide explains the changes required to migrate from `aws-testing-framework` v0.2.0 to v0.6.1.

## Overview of Changes

Version 0.6.1 introduces significant architectural improvements:

- **Dependency Injection**: Framework now uses a DI container for better testability
- **Service-based Architecture**: Methods organized into dedicated service classes
- **Simplified Setup**: Single support file replaces multiple step definition imports
- **Improved Type Safety**: Better TypeScript support and type definitions

## Breaking Changes

### 1. Node.js Version Requirement

**Before:** Node.js >= 18.0.0
**After:** Node.js >= 20.16.0

Update your `package.json`:

```json
{
  "engines": {
    "node": ">=20.16.0"
  }
}
```

### 2. Cucumber Configuration

**Before:**
```javascript
module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'node_modules/aws-testing-framework/dist/steps/s3-steps.js',
      'node_modules/aws-testing-framework/dist/steps/lambda-steps.js',
      'node_modules/aws-testing-framework/dist/steps/step-function-steps.js',
      'node_modules/aws-testing-framework/dist/steps/sqs-steps.js',
      'node_modules/aws-testing-framework/dist/steps/correlation-steps.js',
      'node_modules/aws-testing-framework/dist/steps/monitoring-steps.js'
    ],
    // ...
  }
};
```

**After:**
```javascript
module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'features/step_definitions/framework-support.ts'
    ],
    // ...
  }
};
```

### 3. Framework Support File

Create `features/step_definitions/framework-support.ts`:

```typescript
import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import {
  initializeFramework,
  getContainer,
  getStepFactory,
  disposeFramework,
  S3Steps,
  LambdaSteps,
  SQSSteps,
  StepFunctionSteps,
} from 'aws-testing-framework/cucumber';
import type { StepContext } from 'aws-testing-framework';

setDefaultTimeout(60000);

Before(async function (this: StepContext) {
  initializeFramework();
  this.container = getContainer();
  
  const stepFactory = getStepFactory();
  stepFactory.registerStepDefinition(S3Steps);
  stepFactory.registerStepDefinition(LambdaSteps);
  stepFactory.registerStepDefinition(SQSSteps);
  stepFactory.registerStepDefinition(StepFunctionSteps);
});

After(async function (this: StepContext) {
  await disposeFramework();
  this.container = undefined;
});
```

### 4. API Changes in Custom Steps

#### Service Access

**Before:**
```typescript
const framework = new AWSTestingFramework();
```

**After:**
```typescript
const framework = new AWSTestingFramework();
const s3Service = framework.s3Service;
const lambdaService = framework.lambdaService;
const sqsService = framework.sqsService;
const stepFunctionService = framework.stepFunctionService;
const healthValidator = framework.healthValidator;
```

#### Method Calls

**Before:**
```typescript
await framework.checkLambdaExecution(functionName);
await framework.getLambdaLogs(functionName, startTime, endTime);
await framework.countLambdaExecutions(functionName, startTime, endTime);
await framework.waitForCondition(async () => { /* ... */ });
```

**After:**
```typescript
await lambdaService.checkLambdaExecution(functionName);
await lambdaService.getLambdaLogs(functionName, startTime, endTime);
await lambdaService.countLambdaExecutions(functionName, startTime, endTime);
await healthValidator.waitForCondition(async () => { /* ... */ });
```

#### S3 Operations

**Before:**
```typescript
await framework.s3Service.uploadFile(bucketName, fileName, content);
```

**After:**
```typescript
await s3Service.uploadFile(bucketName, fileName, content);
```

### 5. Removed/Changed Methods

| Before | After | Notes |
|--------|-------|-------|
| `framework.generateCorrelationId()` | Removed | Use UUID library directly |
| `framework.configureReporter()` | Removed | Use `framework.reporter` directly |
| `framework.getReporter()` | `framework.reporter` | Changed to property |
| `framework.cleanup()` | `framework.dispose()` | Method renamed |
| `framework.checkLambdaExecution()` | `lambdaService.checkLambdaExecution()` | Moved to service |
| `framework.getLambdaLogs()` | `lambdaService.getLambdaLogs()` | Moved to service |
| `framework.countLambdaExecutions()` | `lambdaService.countLambdaExecutions()` | Moved to service |
| `framework.waitForCondition()` | `healthValidator.waitForCondition()` | Moved to HealthValidator |

## Step-by-Step Migration

### Step 1: Update Dependencies

```bash
npm install aws-testing-framework@0.6.1
```

### Step 2: Update Node.js Version

Ensure you're using Node.js 20.16.0 or higher:

```bash
node --version
```

### Step 3: Create Framework Support File

Create the support file as shown in section 3 above.

### Step 4: Update Cucumber Configurations

Update all your `cucumber-*.js` files to use the new support file.

### Step 5: Refactor Custom Steps

Update your custom step definitions to use the new service-based API:

1. Extract services from the framework instance
2. Update method calls to use the appropriate service
3. Replace `waitForCondition` calls with `healthValidator.waitForCondition`
4. Add TypeScript type annotations for log arrays: `(log: string) =>`

### Step 6: Build and Test

```bash
npm run build
npm test
```

## New Features in v0.6.1

- **CLI Tools**: `aws-testing-framework` and `awstf` command-line utilities
- **Factory Methods**: Static factory methods for common configurations
- **Better DI**: Improved dependency injection for easier testing and extension
- **Type Safety**: Enhanced TypeScript definitions and interfaces

## Common Issues

### Issue: "Property does not exist on type 'AWSTestingFramework'"

**Solution**: The method has been moved to a service. Check the API changes table above.

### Issue: Build errors with implicit 'any' type

**Solution**: Add type annotations to array methods:
```typescript
logs.some((log: string) => ...)
```

### Issue: Tests fail with "container not found"

**Solution**: Ensure you're including the framework support file in your cucumber configuration.

## Need Help?

- Check the [framework documentation](https://github.com/sophiegle/aws-testing-framework)
- Review the updated examples in this repository
- Open an issue on the [GitHub repository](https://github.com/sophiegle/aws-testing-framework-test/issues)

## Summary

The upgrade to v0.6.1 brings significant improvements to the framework's architecture and usability. While there are breaking changes, the migration path is straightforward:

1. ✅ Update Node.js to 20.16.0+
2. ✅ Update package.json
3. ✅ Create framework support file
4. ✅ Update cucumber configurations
5. ✅ Refactor custom steps to use services
6. ✅ Build and test

The new architecture provides better separation of concerns, improved testability, and a cleaner API surface.

