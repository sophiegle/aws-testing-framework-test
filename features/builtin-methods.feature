Feature: Using Built-in Framework Methods
  As a developer
  I want to use the AWS Testing Framework's built-in step definitions
  So that I can quickly test AWS serverless workflows

  Background:
    Given I have an S3 bucket named "my-example-bucket"
    And I have a Lambda function named "my-example-lambda"
    And I have a Step Function named "my-example-step-function"

  Scenario: Test S3 to Lambda workflow using built-in methods
    When I upload a file "test-data.json" with content '{"key": "value"}' to the S3 bucket
    Then the Lambda function should be invoked
    And the Lambda function should process the exact file "test-data.json"
    And the Lambda function logs should contain "Processing file"

  Scenario: Test complete pipeline with correlation tracking
    When I upload a file "pipeline-test.json" with content '{"pipeline": "test"}' to the S3 bucket
    Then I should be able to trace the file "pipeline-test.json" through the entire pipeline
    And the Step Function should be executed
    And the Step Function execution should complete successfully

  Scenario: Test error handling and monitoring
    When I upload a file "error-test.json" with content "invalid-json" to the S3 bucket
    Then the Lambda function should have no errors in the last 10 minutes
    And the Lambda function logs should contain "Error processing file"
    And the Lambda function should have acceptable execution metrics 