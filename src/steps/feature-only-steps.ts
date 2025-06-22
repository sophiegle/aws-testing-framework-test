import { Then, When } from '@cucumber/cucumber';
import { AWSTestingFramework, type StepContext } from 'aws-testing-framework';

const framework = new AWSTestingFramework();

// Step for checking if S3 bucket contains a file
Then(
  'the S3 bucket should contain the file {string}',
  async function (this: StepContext, fileName: string) {
    if (!this.bucketName) {
      throw new Error('Bucket name is not set');
    }
    
    await framework.waitForCondition(async () => {
      return await framework.checkFileExists(this.bucketName!, fileName);
    }, 30000);
  }
);

// Step for Lambda execution metrics
Then(
  'the Lambda function should have acceptable execution metrics',
  async function (this: StepContext) {
    if (!this.functionName) {
      throw new Error('Lambda function name is not set');
    }
    
    const startTime = new Date(Date.now() - 300000); // 5 minutes ago
    const endTime = new Date();
    
    const metrics = await framework.getLambdaExecutionMetrics(
      this.functionName,
      startTime,
      endTime
    );
    
    // Check for reasonable execution metrics
    if (metrics.averageDuration > 30000) {
      throw new Error(`Average execution time ${metrics.averageDuration}ms is too high`);
    }
    
    if (metrics.errors > 5) {
      throw new Error(`Too many errors: ${metrics.errors}`);
    }
  }
);

// Step for Step Function data loss/corruption check
Then(
  'the Step Function should have no data loss or corruption',
  async function (this: StepContext) {
    if (!this.stateMachineName) {
      throw new Error('Step Function name is not set');
    }
    
    const executions = await framework.getExecutionDetails(this.stateMachineName);
    
    if (executions.length === 0) {
      throw new Error('No Step Function executions found');
    }
    
    const latestExecution = executions[executions.length - 1];
    
    // Get data flow analysis
    const dataFlow = await framework.getStepFunctionDataFlow(latestExecution.executionArn);
    
    if (dataFlow.dataLoss) {
      throw new Error('Data loss detected in Step Function execution');
    }
    
    if (dataFlow.dataCorruption) {
      throw new Error('Data corruption detected in Step Function execution');
    }
  }
);

// Step for Step Function SLA verification
Then(
  'the Step Function should meet performance SLAs',
  async function (this: StepContext) {
    if (!this.stateMachineName) {
      throw new Error('Step Function name is not set');
    }
    
    const executions = await framework.getExecutionDetails(this.stateMachineName);
    
    if (executions.length === 0) {
      throw new Error('No Step Function executions found');
    }
    
    const latestExecution = executions[executions.length - 1];
    
    // Define SLA requirements
    const slas = {
      maxTotalExecutionTime: 60000, // 60 seconds
      maxStateExecutionTime: 10000, // 10 seconds per state
      maxColdStartTime: 5000 // 5 seconds
    };
    
    const slaVerification = await framework.verifyStepFunctionSLAs(
      latestExecution.executionArn,
      slas
    );
    
    if (!slaVerification.meetsSLAs) {
      throw new Error(`SLA violations: ${slaVerification.violations.join(', ')}`);
    }
  }
);

// Step for uploading multiple files
When(
  'I upload multiple files to the S3 bucket',
  async function (this: StepContext) {
    if (!this.bucketName) {
      throw new Error('Bucket name is not set');
    }
    
    const files = [
      { name: 'file1.json', content: JSON.stringify({ id: 1, data: 'test1' }) },
      { name: 'file2.json', content: JSON.stringify({ id: 2, data: 'test2' }) },
      { name: 'file3.json', content: JSON.stringify({ id: 3, data: 'test3' }) },
    ];
    
    for (const file of files) {
      const correlationId = framework.generateCorrelationId();
      this.correlationId = correlationId;
      
      await framework.uploadFileWithTracking(
        this.bucketName!,
        file.name,
        file.content,
        correlationId
      );
      
      // Wait a bit between uploads
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
);

// Step for tracing all files through pipeline
Then(
  'I should be able to trace all files through the entire pipeline',
  async function (this: StepContext) {
    if (!this.correlationId) {
      throw new Error('Correlation ID is not set');
    }
    
    const files = ['file1.json', 'file2.json', 'file3.json'];
    
    for (const fileName of files) {
      const trace = await framework.traceFileThroughWorkflow(fileName, this.correlationId);
      
      if (!trace) {
        throw new Error(`Could not trace file ${fileName} through the pipeline`);
      }
      
      if (!trace.s3Event) {
        throw new Error(`S3 event not found for file ${fileName}`);
      }
      
      if (!trace.lambdaExecution) {
        throw new Error(`Lambda execution not found for file ${fileName}`);
      }
    }
  }
);

// Step for checking Lambda logs don't contain errors
Then(
  'the Lambda function logs should not contain errors',
  async function (this: StepContext) {
    if (!this.functionName) {
      throw new Error('Lambda function name is not set');
    }
    
    const startTime = new Date(Date.now() - 60000);
    const endTime = new Date();
    
    const errorCheck = await framework.checkLambdaLogErrors(
      this.functionName,
      startTime,
      endTime
    );
    
    if (errorCheck.hasErrors) {
      throw new Error(`Lambda logs contain errors: ${errorCheck.errorCount} errors found`);
    }
  }
);

// Step for Step Function definition validation
Then(
  'the Step Function should have a valid definition',
  async function (this: StepContext) {
    if (!this.stateMachineName) {
      throw new Error('Step Function name is not set');
    }
    
    const definition = await framework.verifyStepFunctionDefinition(this.stateMachineName);
    
    if (!definition.isValid) {
      throw new Error(`Step Function definition is invalid: ${definition.errors.join(', ')}`);
    }
    
    if (!definition.hasStartState) {
      throw new Error('Step Function definition missing start state');
    }
    
    if (!definition.hasEndStates) {
      throw new Error('Step Function definition missing end states');
    }
  }
); 