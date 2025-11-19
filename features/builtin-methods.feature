Feature: Using Built-in Framework Methods
  As a developer
  I want to use the AWS Testing Framework's built-in step definitions
  So that I can quickly test AWS serverless workflows

  Background:
    Given I have an S3 bucket named "awstestingframeworkinfrastructu-aftibucket816930f0-eebqmqrjqual"
    And I have a Lambda function named "afti-lambda-function"
    And I have a Step Function named "AftiStateMachineC1791690-QAqGBKOfbfLM"

  Scenario: Test S3 file upload and verification
    When I upload a file "verification-test.json" with content '{"test": "data"}' to the S3 bucket
    Then the S3 bucket should contain the file "verification-test.json"

  Scenario: Test S3 to Lambda workflow using built-in methods
    When I upload a file "test-data.json" with content '{"key": "value"}' to the S3 bucket
    Then the Lambda function should be invoked
    And the Step Function execution ARN should be captured
    And the Step Function should be executed

  Scenario: Test Lambda direct invocation
    When I invoke the Lambda function with payload '{"action": "test"}'
    Then the Lambda function should be invoked

  Scenario: Test Step Function manual execution
    When I start the Step Function execution with input '{"test": "manual-execution"}'
    Then the Step Function execution should succeed

  Scenario: Test Lambda execution counting
    When I upload many files to the S3 bucket
    Then the Lambda function should be invoked 10 times within 10 minutes

  Scenario: Test multiple file uploads
    When I upload multiple files to the S3 bucket
    Then the S3 bucket should contain the file "file1.txt"
    And the S3 bucket should contain the file "file2.txt"
    And the S3 bucket should contain the file "file3.txt"

  Scenario: Test concurrent operations
    When I trigger multiple concurrent operations
    Then the Lambda function should be invoked

  Scenario: Test error handling and monitoring
    When I upload a file "error-test.json" with content "invalid-json" to the S3 bucket
    Then the Lambda function should be invoked
    And the Lambda function logs should not contain errors 