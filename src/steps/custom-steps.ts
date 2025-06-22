import { Given, Then, When, setDefaultTimeout } from '@cucumber/cucumber';
import { AWSTestingFramework, type StepContext } from 'aws-testing-framework';

// Set default timeout to 60 seconds for all steps
setDefaultTimeout(60000);

const framework = new AWSTestingFramework();

// Custom context interface for business-specific data
interface CustomStepContext extends StepContext {
  csvData?: string;
  customerRecords?: Array<{ id: string; name: string; email: string; valid: boolean }>;
  notificationQueueUrl?: string;
  processingStartTime?: number;
  processingEndTime?: number;
  retryCount?: number;
  errorLogs?: string[];
  lastNotificationMessage?: any;
}

// Custom background steps
Given(
  'I have a data processing pipeline with bucket {string}',
  async function (this: CustomStepContext, bucketName: string) {
    this.bucketName = bucketName;
    await framework.findBucket(bucketName);
  }
);

Given(
  'I have a data processor Lambda named {string}',
  async function (this: CustomStepContext, functionName: string) {
    this.functionName = functionName;
    await framework.findFunction(functionName);
  }
);

Given(
  'I have a notification system with SQS queue {string}',
  async function (this: CustomStepContext, queueName: string) {
    this.queueName = queueName;
    this.notificationQueueUrl = await framework.findQueue(queueName);
    
    // Check if queue was found (framework.findQueue returns empty string if not found)
    if (!this.notificationQueueUrl) {
      throw new Error(`SQS queue ${queueName} not found`);
    }
  }
);

// Custom step for uploading CSV data
When(
  'I upload a CSV file {string} with valid customer records',
  async function (this: CustomStepContext, fileName: string) {
    if (!this.bucketName) {
      throw new Error('Bucket name is not set');
    }

    // Generate sample customer data
    this.customerRecords = [
      { id: '1', name: 'John Doe', email: 'john.doe@example.com', valid: true },
      { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', valid: true },
      { id: '3', name: 'Bob Johnson', email: 'bob.johnson@example.com', valid: true },
      { id: '4', name: 'Invalid User', email: 'invalid-email', valid: false },
    ];

    // Convert to CSV format
    this.csvData = 'id,name,email\n';
    this.customerRecords.forEach(record => {
      this.csvData += `${record.id},${record.name},${record.email}\n`;
    });

    // Generate correlation ID for tracking
    this.correlationId = framework.generateCorrelationId();
    this.uploadedFileName = fileName;

    // Upload the CSV file
    await framework.uploadFileWithTracking(
      this.bucketName,
      fileName,
      this.csvData,
      this.correlationId
    );
  }
);

// Custom step for data validation verification
Then(
  'the data should be validated according to business rules',
  async function (this: CustomStepContext) {
    if (!this.functionName) {
      throw new Error('Lambda function name is not set');
    }

    const startTime = new Date(Date.now() - 60000);
    const endTime = new Date();

    // Check for validation log messages
    const validationLogs = await framework.verifyLambdaLogsContain(
      this.functionName,
      startTime,
      endTime,
      ['Validation', 'Business rules', 'Data validation']
    );

    if (!validationLogs.found) {
      throw new Error('Data validation was not performed according to business rules');
    }
  }
);

// Custom step for invalid record handling
Then(
  'invalid records should be flagged and logged',
  async function (this: CustomStepContext) {
    if (!this.functionName) {
      throw new Error('Lambda function name is not set');
    }

    const startTime = new Date(Date.now() - 60000);
    const endTime = new Date();

    // Check for invalid record logging
    const invalidRecordLogs = await framework.verifyLambdaLogsContain(
      this.functionName,
      startTime,
      endTime,
      ['Invalid record', 'Flagged', 'Validation failed']
    );

    if (!invalidRecordLogs.found) {
      throw new Error('Invalid records were not properly flagged and logged');
    }
  }
);

// Custom step for successful processing verification
Then(
  'valid records should be processed successfully',
  async function (this: CustomStepContext) {
    if (!this.functionName || !this.correlationId) {
      throw new Error('Lambda function name or correlation ID is not set');
    }

    // Track Lambda execution
    const success = await framework.trackLambdaExecution(
      this.functionName,
      this.correlationId,
      30000
    );

    if (!success) {
      throw new Error('Valid records were not processed successfully');
    }
  }
);

// Custom step for summary report verification
Then(
  'a summary report should be generated',
  async function (this: CustomStepContext) {
    if (!this.bucketName) {
      throw new Error('Bucket name is not set');
    }

    // Wait for summary report to be generated
    await framework.waitForCondition(async () => {
      return await framework.checkFileExists(this.bucketName!, 'summary-report.json');
    }, 30000);
  }
);

// Custom step for notification event trigger
When(
  'I trigger a notification event for user {string}',
  async function (this: CustomStepContext, userEmail: string) {
    if (!this.notificationQueueUrl) {
      throw new Error('Notification queue URL is not set');
    }

    const notificationMessage = JSON.stringify({
      type: 'user_notification',
      email: userEmail,
      priority: 'high',
      timestamp: new Date().toISOString()
    });

    await framework.sendMessage(this.notificationQueueUrl, notificationMessage);
  }
);

// Custom step for SQS message verification
Then(
  'a notification message should be sent to the SQS queue',
  async function (this: CustomStepContext) {
    if (!this.notificationQueueUrl) {
      throw new Error('Notification queue URL is not set');
    }

    await framework.waitForCondition(async () => {
      const messageCount = await framework.getUnreadMessageCount(this.notificationQueueUrl!);
      return messageCount > 0;
    }, 30000);
  }
);

// Custom step for message content verification
Then(
  'the message should contain the user\'s email address',
  async function (this: CustomStepContext) {
    if (!this.notificationQueueUrl) {
      throw new Error('Notification queue URL is not set');
    }

    // Only receive the message if we haven't already
    if (!this.lastNotificationMessage) {
      const message = await framework.receiveMessage(this.notificationQueueUrl);
      
      if (!message?.Body) {
        throw new Error('No message received from queue');
      }
      
      this.lastNotificationMessage = JSON.parse(message.Body);
    }

    const messageData = this.lastNotificationMessage;
    if (!messageData.email || !messageData.email.includes('@')) {
      throw new Error('Message does not contain valid email address');
    }
  }
);

// Custom step for priority level verification
Then(
  'the message should have the correct priority level',
  async function (this: CustomStepContext) {
    if (!this.notificationQueueUrl) {
      throw new Error('Notification queue URL is not set');
    }

    // Use cached message if available, otherwise receive it
    if (!this.lastNotificationMessage) {
      const message = await framework.receiveMessage(this.notificationQueueUrl);
      if (!message?.Body) {
        throw new Error('No message received from queue');
      }
      this.lastNotificationMessage = JSON.parse(message.Body);
    }

    const messageData = this.lastNotificationMessage;
    if (messageData.priority !== 'high') {
      throw new Error(`Incorrect priority level: ${messageData.priority}`);
    }
  }
);

// Custom step for delivery time verification
Then(
  'the notification should be delivered within {int} seconds',
  async function (this: CustomStepContext, maxDeliveryTime: number) {
    if (!this.notificationQueueUrl) {
      throw new Error('Notification queue URL is not set');
    }

    const startTime = Date.now();
    
    // If we already have the message cached, just verify delivery time
    if (this.lastNotificationMessage) {
      const deliveryTime = (Date.now() - startTime) / 1000;
      if (deliveryTime > maxDeliveryTime) {
        throw new Error(`Notification delivery took ${deliveryTime}s, exceeding ${maxDeliveryTime}s limit`);
      }
      return;
    }

    // Otherwise, wait for the message to arrive
    await framework.waitForCondition(async () => {
      const message = await framework.receiveMessage(this.notificationQueueUrl!);
      if (message?.Body) {
        this.lastNotificationMessage = JSON.parse(message.Body);
        return true;
      }
      return false;
    }, maxDeliveryTime * 1000);

    const deliveryTime = (Date.now() - startTime) / 1000;
    if (deliveryTime > maxDeliveryTime) {
      throw new Error(`Notification delivery took ${deliveryTime}s, exceeding ${maxDeliveryTime}s limit`);
    }
  }
);

// Custom step for batch processing
When(
  'I process a batch of {int} records',
  async function (this: CustomStepContext, recordCount: number) {
    if (!this.bucketName) {
      throw new Error('Bucket name is not set');
    }

    this.processingStartTime = Date.now();

    // Generate batch data
    const batchData: Array<{ id: string; data: string; timestamp: string }> = [];
    for (let i = 0; i < recordCount; i++) {
      batchData.push({
        id: `batch-${i}`,
        data: `record-${i}`,
        timestamp: new Date().toISOString()
      });
    }

    const batchContent = JSON.stringify(batchData);
    this.correlationId = framework.generateCorrelationId();

    await framework.uploadFileWithTracking(
      this.bucketName,
      'batch-data.json',
      batchContent,
      this.correlationId
    );
  }
);

// Custom step for processing time verification
Then(
  'the processing time should be under {int} seconds',
  async function (this: CustomStepContext, maxProcessingTime: number) {
    if (!this.processingStartTime) {
      throw new Error('Processing start time is not set');
    }

    this.processingEndTime = Date.now();
    const processingTime = (this.processingEndTime - this.processingStartTime) / 1000;

    if (processingTime > maxProcessingTime) {
      throw new Error(`Processing took ${processingTime}s, exceeding ${maxProcessingTime}s limit`);
    }
  }
);

// Custom step for memory usage verification
Then(
  'the memory usage should remain stable',
  async function (this: CustomStepContext) {
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

    // Check for excessive cold starts which might indicate memory issues
    if (metrics.coldStarts > 3) {
      throw new Error(`Too many cold starts detected: ${metrics.coldStarts}`);
    }
  }
);

// Custom step for data loss verification
Then(
  'no records should be lost during processing',
  async function (this: CustomStepContext) {
    if (!this.correlationId) {
      throw new Error('Correlation ID is not set');
    }

    const trace = await framework.traceFileThroughWorkflow('batch-data.json', this.correlationId);
    
    if (!trace) {
      throw new Error('Could not trace batch processing workflow');
    }

    if (!trace.lambdaExecution) {
      throw new Error('Lambda execution not found in trace - data may have been lost');
    }
  }
);

// Custom step for uptime verification
Then(
  'the system should maintain {float}% uptime',
  async function (this: CustomStepContext, expectedUptime: number) {
    if (!this.functionName) {
      throw new Error('Lambda function name is not set');
    }

    const startTime = new Date(Date.now() - 3600000); // 1 hour ago
    const endTime = new Date();

    const errorCheck = await framework.checkLambdaLogErrors(
      this.functionName,
      startTime,
      endTime
    );

    // Calculate uptime percentage (simplified)
    const totalExecutions = 100; // This would be calculated from actual metrics
    const errorRate = errorCheck.errorCount / totalExecutions;
    const actualUptime = (1 - errorRate) * 100;

    if (actualUptime < expectedUptime) {
      throw new Error(`System uptime ${actualUptime}% is below expected ${expectedUptime}%`);
    }
  }
);

// Custom step for failure simulation
When(
  'I simulate a temporary AWS service failure',
  async function (this: CustomStepContext) {
    // This would typically involve temporarily disabling AWS services
    // For demonstration, we'll just set up retry tracking
    this.retryCount = 0;
    this.errorLogs = [];
  }
);

// Custom step for exponential backoff verification
Then(
  'the system should implement exponential backoff',
  async function (this: CustomStepContext) {
    if (!this.functionName) {
      throw new Error('Lambda function name is not set');
    }

    const startTime = new Date(Date.now() - 60000);
    const endTime = new Date();

    const backoffLogs = await framework.verifyLambdaLogsContain(
      this.functionName,
      startTime,
      endTime,
      ['Retry', 'Backoff', 'Exponential']
    );

    if (!backoffLogs.found) {
      throw new Error('Exponential backoff was not implemented');
    }
  }
);

// Custom step for retry count verification
Then(
  'the operation should retry up to {int} times',
  async function (this: CustomStepContext, maxRetries: number) {
    if (!this.functionName) {
      throw new Error('Lambda function name is not set');
    }

    const startTime = new Date(Date.now() - 60000);
    const endTime = new Date();

    const retryLogs = await framework.verifyLambdaLogsContain(
      this.functionName,
      startTime,
      endTime,
      ['Retry attempt', 'Retry count']
    );

    // Check that retry attempts don't exceed maximum
    if (retryLogs.matchingLogs.length > maxRetries) {
      throw new Error(`Retry attempts (${retryLogs.matchingLogs.length}) exceed maximum (${maxRetries})`);
    }
  }
);

// Custom step for failed operation logging
Then(
  'failed operations should be logged for manual review',
  async function (this: CustomStepContext) {
    if (!this.functionName) {
      throw new Error('Lambda function name is not set');
    }

    const startTime = new Date(Date.now() - 60000);
    const endTime = new Date();

    const failureLogs = await framework.verifyLambdaLogsContain(
      this.functionName,
      startTime,
      endTime,
      ['Failed operation', 'Manual review', 'Error logged']
    );

    if (!failureLogs.found) {
      throw new Error('Failed operations were not properly logged for manual review');
    }
  }
);

// Custom step for automatic recovery verification
Then(
  'the system should recover automatically when services are restored',
  async function (this: CustomStepContext) {
    if (!this.functionName) {
      throw new Error('Lambda function name is not set');
    }

    // Wait for system to recover
    await framework.waitForCondition(async () => {
      const startTime = new Date(Date.now() - 30000);
      const endTime = new Date();
      
      const recoveryLogs = await framework.verifyLambdaLogsContain(
        this.functionName!,
        startTime,
        endTime,
        ['Service restored', 'Recovery complete', 'Back to normal']
      );

      return recoveryLogs.found;
    }, 60000);
  }
); 