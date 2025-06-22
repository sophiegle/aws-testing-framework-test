# Setup Instructions

This document explains how to set up and configure the AWS Testing Framework examples with your actual AWS resources.

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **Node.js 18+** installed
3. **AWS CLI** configured with credentials
4. **AWS Resources** deployed (S3 bucket, Lambda function, Step Function, SQS queue)

## Step 1: Install Dependencies

```bash
npm install
```

This will install the `aws-testing-framework` package and all required dependencies.

## Step 2: Configure AWS Credentials

Ensure your AWS credentials are properly configured:

```bash
# Option 1: Using AWS CLI
aws configure

# Option 2: Using environment variables
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_REGION=eu-west-2
```

## Step 3: Update Resource Names

The example project uses placeholder resource names that you need to replace with your actual AWS resources.

### Current Placeholder Names:
- **S3 Bucket:** `my-example-bucket`
- **Lambda Function:** `my-example-lambda`
- **Step Function:** `my-example-step-function`
- **SQS Queue:** `my-example-queue`

### Files to Update:

1. **`features/builtin-methods.feature`**
2. **`features/custom-steps.feature`**
3. **`features/extend-steps.feature`**
4. **`features/feature-only.feature`**

### Example Update:

Replace this:
```gherkin
Given I have an S3 bucket named "my-example-bucket"
And I have a Lambda function named "my-example-lambda"
And I have a Step Function named "my-example-step-function"
```

With your actual resource names:
```gherkin
Given I have an S3 bucket named "my-actual-bucket-name"
And I have a Lambda function named "my-actual-lambda-name"
And I have a Step Function named "my-actual-step-function-name"
```

## Step 4: Verify AWS Resources

Before running tests, ensure your AWS resources are properly configured:

### S3 Bucket
- Bucket exists and is accessible
- Event notifications configured (if testing S3 triggers)
- Appropriate permissions set

### Lambda Function
- Function exists and is accessible
- Runtime and handler configured correctly
- Environment variables set (if needed)
- Logging enabled

### Step Function
- State machine exists and is accessible
- Definition is valid
- Execution role has appropriate permissions

### SQS Queue
- Queue exists and is accessible
- Appropriate permissions set
- Dead letter queue configured (if needed)

## Step 5: Test Configuration

Run a simple test to verify your configuration:

```bash
# Test a single scenario first
npm run test:builtin
```

If tests fail with "resource not found" errors, double-check:
1. Resource names are correct
2. AWS credentials are valid
3. AWS region is correct
4. Resources exist in the specified region

## Step 6: Run All Examples

Once basic configuration is working:

```bash
# Run all usage patterns
npm run test:all

# Or run individual patterns
npm run test:builtin
npm run test:custom-steps
npm run test:extend-steps
npm run test:feature-only
```

## Troubleshooting

### Common Issues

1. **"Bucket not found" error**
   - Verify bucket name is correct
   - Check AWS region
   - Ensure bucket exists in the specified region

2. **"Lambda function not found" error**
   - Verify function name is correct
   - Check AWS region
   - Ensure function exists and is accessible

3. **"Step Function not found" error**
   - Verify state machine name is correct
   - Check AWS region
   - Ensure state machine exists and is accessible

4. **"SQS queue not found" error**
   - Verify queue name is correct
   - Check AWS region
   - Ensure queue exists and is accessible

5. **Permission errors**
   - Check IAM permissions
   - Verify AWS credentials have appropriate access
   - Ensure resources are in the correct AWS account

### Debug Mode

Enable debug logging to see more details:

```bash
# Set debug environment variable
export DEBUG=aws-testing-framework:*

# Run tests with debug output
npm run test:builtin
```

### Resource Verification

You can verify your resources exist using AWS CLI:

```bash
# Check S3 bucket
aws s3 ls s3://your-bucket-name

# Check Lambda function
aws lambda get-function --function-name your-function-name

# Check Step Function
aws stepfunctions describe-state-machine --state-machine-arn your-state-machine-arn

# Check SQS queue
aws sqs get-queue-url --queue-name your-queue-name
```

## Next Steps

Once your examples are working:

1. **Customize the examples** for your specific use cases
2. **Add your own scenarios** based on your AWS workflows
3. **Extend the framework** with custom step definitions
4. **Integrate with CI/CD** for automated testing
5. **Share your improvements** with the community

## Support

If you encounter issues:

1. **Check the troubleshooting section** above
2. **Review the main framework documentation**
3. **Open an issue** in the GitHub repository
4. **Check existing issues** for similar problems

Remember: The examples are designed to demonstrate the framework's capabilities. You may need to adjust them based on your specific AWS architecture and requirements. 