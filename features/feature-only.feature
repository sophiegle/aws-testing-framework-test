Feature: Feature-Only Testing
  As a business analyst
  I want to write tests using only feature files
  So that I can focus on behavior without implementation details

  Background:
    Given I have an S3 bucket named "my-example-bucket"
    And I have a Lambda function named "my-example-lambda"
    And I have a Step Function named "my-example-step-function"

  Scenario: Test simple S3 to Lambda workflow
    When I upload a file "simple-test.json" with content '{"simple": "test"}' to the S3 bucket
    Then the Lambda function should be invoked
    And the Lambda function should process the file successfully

  Scenario: Test file processing workflow
    When I upload a file "process-test.json" with content '{"process": "test"}' to the S3 bucket
    Then the file should be processed by the Lambda function
    And the processing should complete without errors
    And the results should be available in the S3 bucket

  Scenario: Test error handling workflow
    When I upload a file "error-test.json" with content "invalid content" to the S3 bucket
    Then the Lambda function should handle the error gracefully
    And the error should be logged appropriately
    And the system should continue to function normally 