Feature: Custom Business Logic Testing
  As a business analyst
  I want to test specific business workflows
  So that I can ensure our custom business logic works correctly

  Background:
    Given I have a data processing pipeline with bucket "awstestingframeworkinfrastructu-aftibucket816930f0-eebqmqrjqual"
    And I have a data processor Lambda named "afti-lambda-function"
    And I have a notification system with SQS queue "afti-queue"

  Scenario: Test custom notification workflow
    When I trigger a notification event for user "john.doe@example.com"
    Then a notification message should be sent to the SQS queue
    And the message should contain the user's email address
    And the message should have the correct priority level

  Scenario: Test data processing workflow
    When I upload a data file "customer-data.csv" with content "name,email,priority" to the S3 bucket
    Then the data should be processed by the Lambda function
    And the processed results should be stored in the S3 bucket
    And a notification should be sent for successful processing

  Scenario: Test Lambda execution counting
    When I upload many files to the S3 bucket
    Then the Lambda function should be invoked 10 times within 10 minutes

  Scenario: Test error handling in custom workflow
    When I upload an invalid data file "invalid-data.txt" with content "invalid content" to the S3 bucket
    Then an error notification should be sent to the SQS queue
    And the error message should contain appropriate error details
    And the system should log the error for debugging
