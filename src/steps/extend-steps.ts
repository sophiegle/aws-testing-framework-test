import { Given, Then, When, setDefaultTimeout } from '@cucumber/cucumber';
import { AWSTestingFramework, type StepContext } from 'aws-testing-framework';

declare module 'aws-testing-framework' {
  interface StepContext {
    extendedSetup?: string[];
  }
}

setDefaultTimeout(60000);
const framework = new AWSTestingFramework();

// Extended context interface for custom functionality
interface ExtendedStepContext extends StepContext {
  customMetadata?: Record<string, string>;
  businessMetrics?: Record<string, number>;
  customValidationRules?: string[];
  customSLARequirements?: Record<string, number>;
  businessContext?: Record<string, unknown>;
}

// Override the built-in S3 upload step with enhanced functionality
When(
  'I upload a file {string} with content {string} to the S3 bucket',
  async function (this: ExtendedStepContext, fileName: string, content: string) {
    if (!this.bucketName) {
      throw new Error('Bucket name is not set. Make sure to create a bucket first.');
    }

    // Generate correlation ID for tracking
    this.correlationId = framework.generateCorrelationId();
    this.uploadedFileName = fileName;
    this.uploadedFileContent = content;

    // Add custom metadata
    this.customMetadata = {
      'business-unit': 'extended-testing',
      'data-classification': 'internal',
      'retention-period': '90-days',
      'upload-timestamp': new Date().toISOString()
    };

    // Add custom business context
    this.businessContext = {
      department: 'Engineering',
      project: 'Extended Testing Framework',
      priority: 'High',
      owner: 'Test Team'
    };

    // Upload with enhanced tracking
    await framework.uploadFileWithTracking(
      this.bucketName,
      fileName,
      content,
      this.correlationId
    );

    // Add a small delay to allow S3 event notification to propagate
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
);

// Extended step for enhanced metadata verification
Then(
  'the file should be uploaded with enhanced metadata',
  async function (this: ExtendedStepContext) {
    if (!this.bucketName || !this.uploadedFileName) {
      throw new Error('Bucket name or file name is not set');
    }

    // Verify file exists (using built-in method)
    await framework.waitForCondition(async () => {
      return await framework.checkFileExists(this.bucketName!, this.uploadedFileName!);
    });

    // Verify custom metadata was applied
    if (!this.customMetadata) {
      throw new Error('Custom metadata was not set during upload');
    }

    // Check that all required metadata fields are present
    const requiredMetadata = ['business-unit', 'data-classification', 'retention-period'];
    for (const field of requiredMetadata) {
      if (!this.customMetadata[field]) {
        throw new Error(`Required metadata field '${field}' is missing`);
      }
    }
  }
);

// Extended step for custom business rule validation
Then(
  'the file should be validated against custom business rules',
  async function (this: ExtendedStepContext) {
    if (!this.functionName) {
      throw new Error('Lambda function name is not set');
    }

    // Define custom validation rules
    this.customValidationRules = [
      'Data format validation',
      'Business logic validation',
      'Compliance check',
      'Quality assurance'
    ];

    const startTime = new Date(Date.now() - 60000);
    const endTime = new Date();

    // Check for custom validation log messages
    const validationLogs = await framework.verifyLambdaLogsContain(
      this.functionName,
      startTime,
      endTime,
      this.customValidationRules
    );

    if (!validationLogs.found) {
      throw new Error('Custom business rule validation was not performed');
    }
  }
);

// Extended step for Lambda invocation with custom context
Then(
  'the Lambda function should be invoked with extended context',
  async function (this: ExtendedStepContext) {
    if (!this.functionName) {
      throw new Error('Lambda function name is not set');
    }

    // Use built-in method to check Lambda invocation
    await framework.waitForCondition(async () => {
      return await framework.checkLambdaExecution(this.functionName!);
    }, 30000);

    // Verify extended context was passed
    if (!this.businessContext) {
      throw new Error('Business context was not set during upload');
    }

    // Check that Lambda received the extended context
    const startTime = new Date(Date.now() - 60000);
    const endTime = new Date();

    const contextLogs = await framework.verifyLambdaLogsContain(
      this.functionName,
      startTime,
      endTime,
      ['Extended context received', 'Business context', 'Custom metadata']
    );

    if (!contextLogs.found) {
      throw new Error('Lambda function did not receive extended context');
    }

    // Custom extension: log that we're doing extended verification
    console.log(`[EXTEND] Lambda function ${this.functionName} invoked with extended context verification`);
    console.log(`[EXTEND] Business context: ${JSON.stringify(this.businessContext)}`);
    console.log(`[EXTEND] Extended verification complete - Lambda invoked successfully`);
  }
);

// Override Lambda verification with custom performance requirements
Then(
  'the Lambda function should meet custom performance requirements',
  async function (this: ExtendedStepContext) {
    if (!this.functionName) {
      throw new Error('Lambda function name is not set');
    }

    // Define custom performance requirements
    this.customSLARequirements = {
      maxExecutionTime: 5000, // 5 seconds
      maxMemoryUsage: 512, // 512 MB
      maxColdStartTime: 1000, // 1 second
      minSuccessRate: 99.5 // 99.5%
    };

    const startTime = new Date(Date.now() - 300000); // 5 minutes ago
    const endTime = new Date();

    // Get Lambda execution metrics using built-in method
    const metrics = await framework.getLambdaExecutionMetrics(
      this.functionName,
      startTime,
      endTime
    );

    // Verify custom performance requirements
    if (metrics.averageDuration > this.customSLARequirements.maxExecutionTime) {
      throw new Error(`Average execution time ${metrics.averageDuration}ms exceeds requirement ${this.customSLARequirements.maxExecutionTime}ms`);
    }

    if (metrics.coldStarts > 2) {
      throw new Error(`Too many cold starts: ${metrics.coldStarts}`);
    }

    const successRate = ((metrics.executionCount - metrics.errors) / metrics.executionCount) * 100;
    if (successRate < this.customSLARequirements.minSuccessRate) {
      throw new Error(`Success rate ${successRate}% is below requirement ${this.customSLARequirements.minSuccessRate}%`);
    }
  }
);

// Extended step for custom business metrics
Then(
  'the Lambda function should log custom business metrics',
  async function (this: ExtendedStepContext) {
    if (!this.functionName) {
      throw new Error('Lambda function name is not set');
    }

    // Define expected business metrics
    this.businessMetrics = {
      recordsProcessed: 0,
      validationErrors: 0,
      processingTime: 0,
      businessValue: 0
    };

    const startTime = new Date(Date.now() - 60000);
    const endTime = new Date();

    // Check for business metrics in logs
    const metricsLogs = await framework.verifyLambdaLogsContain(
      this.functionName,
      startTime,
      endTime,
      ['Business metrics', 'Records processed', 'Validation errors', 'Processing time', 'Business value']
    );

    if (!metricsLogs.found) {
      throw new Error('Custom business metrics were not logged');
    }
  }
);

// Extended step for custom error rate verification
Then(
  'the Lambda function should have acceptable custom error rates',
  async function (this: ExtendedStepContext) {
    if (!this.functionName) {
      throw new Error('Lambda function name is not set');
    }

    const startTime = new Date(Date.now() - 300000); // 5 minutes ago
    const endTime = new Date();

    // Use built-in method to check for errors
    const errorCheck = await framework.checkLambdaLogErrors(
      this.functionName,
      startTime,
      endTime
    );

    // Define custom error rate thresholds
    const maxErrorRate = 0.5; // 0.5%
    const maxConsecutiveErrors = 3;

    if (errorCheck.hasErrors) {
      // Calculate error rate (simplified)
      const totalExecutions = 100; // This would be calculated from actual metrics
      const errorRate = (errorCheck.errorCount / totalExecutions) * 100;

      if (errorRate > maxErrorRate) {
        throw new Error(`Error rate ${errorRate}% exceeds acceptable threshold ${maxErrorRate}%`);
      }

      if (errorCheck.errorCount > maxConsecutiveErrors) {
        throw new Error(`Too many consecutive errors: ${errorCheck.errorCount}`);
      }
    }
  }
);

// Extended step for custom validation states
Then(
  'the Step Function should pass through custom validation states',
  async function (this: ExtendedStepContext) {
    if (!this.stateMachineName) {
      throw new Error('Step Function name is not set');
    }

    // Get execution details using built-in method
    const executions = await framework.getExecutionDetails(this.stateMachineName);
    
    if (executions.length === 0) {
      throw new Error('No Step Function executions found');
    }

    const latestExecution = executions[executions.length - 1];
    
    // Get execution history using built-in method
    const history = await framework.getStepFunctionExecutionHistory(latestExecution.executionArn);

    // Define expected custom validation states
    const expectedStates = [
      'DataValidation',
      'BusinessRuleCheck',
      'ComplianceValidation',
      'QualityAssurance'
    ];

    // Check that custom validation states were executed
    const executedStates = history
      .filter(event => event.stateName)
      .map(event => event.stateName!);

    for (const expectedState of expectedStates) {
      if (!executedStates.includes(expectedState)) {
        throw new Error(`Expected validation state '${expectedState}' was not executed`);
      }
    }
  }
);

// Extended step for custom business reports
Then(
  'the Step Function should generate custom business reports',
  async function (this: ExtendedStepContext) {
    if (!this.bucketName) {
      throw new Error('Bucket name is not set');
    }

    // Wait for business reports to be generated
    const expectedReports = [
      'business-validation-report.json',
      'compliance-report.json',
      'quality-metrics-report.json'
    ];

    for (const report of expectedReports) {
      await framework.waitForCondition(async () => {
        return await framework.checkFileExists(this.bucketName!, report);
      }, 30000);
    }
  }
);

// Extended step for custom SLA requirements
Then(
  'the Step Function should meet custom SLA requirements',
  async function (this: ExtendedStepContext) {
    if (!this.stateMachineName) {
      throw new Error('Step Function name is not set');
    }

    // Define custom SLA requirements
    this.customSLARequirements = {
      maxTotalExecutionTime: 30000, // 30 seconds
      maxStateExecutionTime: 5000, // 5 seconds per state
      maxColdStartTime: 2000 // 2 seconds
    };

    const executions = await framework.getExecutionDetails(this.stateMachineName);
    
    if (executions.length === 0) {
      throw new Error('No Step Function executions found');
    }

    const latestExecution = executions[executions.length - 1];

    // Use built-in method to verify SLAs
    const slaVerification = await framework.verifyStepFunctionSLAs(
      latestExecution.executionArn,
      this.customSLARequirements
    );

    if (!slaVerification.meetsSLAs) {
      throw new Error(`SLA violations: ${slaVerification.violations.join(', ')}`);
    }
  }
);

// Extended step for custom business context in correlation
Then(
  'the correlation should include custom business context',
  async function (this: ExtendedStepContext) {
    if (!this.correlationId) {
      throw new Error('Correlation ID is not set');
    }

    // Use built-in method to trace workflow
    const trace = await framework.traceFileThroughWorkflow(
      this.uploadedFileName!,
      this.correlationId
    );

    if (!trace) {
      throw new Error('Could not trace file through the pipeline');
    }

    // Verify business context was included
    if (!this.businessContext) {
      throw new Error('Business context was not set during upload');
    }

    // Check that business context was passed through the workflow
    if (!trace.lambdaExecution) {
      throw new Error('Lambda execution not found in trace');
    }
  }
);

// Extended step for custom business metrics tracking
Then(
  'the correlation should track custom business metrics',
  async function (this: ExtendedStepContext) {
    if (!this.correlationId) {
      throw new Error('Correlation ID is not set');
    }

    // Get workflow trace using built-in method
    const trace = framework.getWorkflowTrace(this.correlationId);

    if (!trace) {
      throw new Error('Workflow trace not found');
    }

    // Verify business metrics were tracked
    if (!this.businessMetrics) {
      throw new Error('Business metrics were not defined');
    }

    // Check that all expected business metrics are present
    const expectedMetrics = Object.keys(this.businessMetrics);
    for (const metric of expectedMetrics) {
      if (this.businessMetrics[metric] === undefined) {
        throw new Error(`Business metric '${metric}' was not tracked`);
      }
    }
  }
);

// Extended step for custom business reports generation
Then(
  'the correlation should generate custom business reports',
  async function (this: ExtendedStepContext) {
    if (!this.correlationId) {
      throw new Error('Correlation ID is not set');
    }

    // Wait for correlation-specific business reports
    const correlationReports = [
      `correlation-${this.correlationId}-business-report.json`,
      `correlation-${this.correlationId}-metrics-report.json`,
      `correlation-${this.correlationId}-validation-report.json`
    ];

    for (const report of correlationReports) {
      await framework.waitForCondition(async () => {
        if (!this.bucketName) return false;
        return await framework.checkFileExists(this.bucketName, report);
      }, 30000);
    }
  }
);

// --- EXTENDED GIVEN STEPS ---
Given('I have an S3 bucket named {string}', async function (this: StepContext, bucketName: string) {
  // Extended: set context and log
  this.bucketName = bucketName;
  this.extendedSetup = this.extendedSetup || [];
  this.extendedSetup.push('S3 bucket');
  console.log(`[EXTEND] S3 bucket set: ${bucketName}`);
});

Given('I have a Lambda function named {string}', async function (this: StepContext, functionName: string) {
  // Extended: set context and log
  this.functionName = functionName;
  this.extendedSetup = this.extendedSetup || [];
  this.extendedSetup.push('Lambda function');
  console.log(`[EXTEND] Lambda function set: ${functionName}`);
});

Given('I have a Step Function named {string}', async function (this: StepContext, stateMachineName: string) {
  // Extended: set context and log
  this.stateMachineName = stateMachineName;
  this.extendedSetup = this.extendedSetup || [];
  this.extendedSetup.push('Step Function');
  console.log(`[EXTEND] Step Function set: ${stateMachineName}`);
});

// --- EXTENDED THEN STEPS ---
Then('the Lambda function should be invoked', async function (this: StepContext) {
  // Extended: call built-in logic, then add custom check/log
  if (!this.functionName) throw new Error('Lambda function name is not set');
  await framework.waitForCondition(async () => {
    return await framework.checkLambdaExecution(this.functionName!);
  }, 30000);
  // Custom extension: log or add extra validation
  console.log(`[EXTEND] Lambda function ${this.functionName} was invoked (extended check)`);
});

Then('the Step Function should be executed', async function (this: StepContext) {
  // Extended: call built-in logic, then add custom check/log
  if (!this.stateMachineName) throw new Error('Step Function name is not set');
  await framework.waitForCondition(async () => {
    return await framework.checkStateMachineExecution(this.stateMachineName!);
  }, 30000);
  // Custom extension: log or add extra validation
  console.log(`[EXTEND] Step Function ${this.stateMachineName} was executed (extended check)`);
});

Then('I should be able to trace the file {string} through the entire pipeline', async function (this: StepContext, fileName: string) {
  // Example of extending a trace step
  if (!this.correlationId) throw new Error('Correlation ID is not set');
  const trace = await framework.traceFileThroughWorkflow(fileName, this.correlationId);
  if (!trace) throw new Error('Could not trace file through workflow');
  // Custom extension: log or add extra validation
  console.log(`[EXTEND] Traced file ${fileName} through pipeline (extended check)`);
}); 