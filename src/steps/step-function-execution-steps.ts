/**
 * Step Function Execution Tracking Steps
 * 
 * This file provides a helper step to capture the Step Function execution ARN
 * when executions are triggered automatically (e.g., by Lambda).
 * 
 * The framework's built-in step "the Step Function should be executed" requires
 * executionArn to be set. When Step Functions are triggered automatically by Lambda,
 * we need to find and capture the execution ARN first, then we can use the framework's
 * built-in step.
 */
import { Then } from '@cucumber/cucumber';
import { AWSTestingFramework, type StepContext } from 'aws-testing-framework';

const framework = new AWSTestingFramework();
const stepFunctionService = framework.stepFunctionService;

// Helper step to capture the Step Function execution ARN when it's triggered automatically
// This should be used before the framework's built-in step "the Step Function should be executed"
// when the Step Function is triggered automatically (e.g., by Lambda) rather than manually
Then('the Step Function execution ARN should be captured', async function (this: StepContext) {
  if (!this.stateMachineName) {
    throw new Error('State machine name is not set. Make sure to create a Step Function first.');
  }

  // If executionArn is already set, no need to capture it
  if (this.executionArn) {
    return;
  }

  // Wait a bit for the execution to start (if it was just triggered)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Find recent executions
  const executions = await stepFunctionService.listExecutions(this.stateMachineName);
  
  if (executions.length === 0) {
    throw new Error(`No executions found for Step Function "${this.stateMachineName}". Make sure the Step Function was triggered.`);
  }

  // Get the most recent execution
  const recentExecutions = executions
    .filter((execution) => execution.startDate)
    .sort((a, b) => {
      const timeA = new Date(a.startDate!).getTime();
      const timeB = new Date(b.startDate!).getTime();
      return timeB - timeA; // Most recent first
    });

  if (recentExecutions.length === 0) {
    throw new Error(`No recent executions found for Step Function "${this.stateMachineName}".`);
  }

  // Capture the execution ARN for use by the framework's built-in step
  const mostRecentExecution = recentExecutions[0];
  this.executionArn = mostRecentExecution.executionArn;
});

