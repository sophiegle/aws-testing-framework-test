Feature: Extending Framework Steps
  As a developer
  I want to extend the AWS Testing Framework's built-in steps
  So that I can add custom business logic and validation

  Background:
    Given I have an S3 bucket named "awstestingframeworkinfrastructu-aftibucket816930f0-eebqmqrjqual"
    And I have a Lambda function named "afti-lambda-function"
    And I have a Step Function named "AftiStateMachineC1791690-QAqGBKOfbfLM"

  Scenario: Test extended S3 upload with custom validation
    When I upload a file "extended-test.json" with content '{"extended": "test"}' to the S3 bucket
    Then the file should be uploaded with enhanced metadata
    And the file should be validated against custom business rules
    And the Lambda function should be invoked with extended context

  Scenario: Test extended Lambda execution with custom monitoring
    When I upload a file "monitoring-test.json" with content '{"monitoring": "test"}' to the S3 bucket
    Then the Lambda function should be invoked with enhanced logging
    And the Lambda execution should include custom business context
    And the Lambda logs should contain extended metadata

  Scenario: Test Lambda execution counting
    When I upload many files to the S3 bucket
    Then the Lambda function should be invoked 10 times within 10 minutes

  Scenario: Test extended Step Function execution
    When I upload a file "step-function-test.json" with content '{"stepFunction": "test"}' to the S3 bucket
    Then the Step Function should be executed with custom parameters
    And the Step Function execution should include business context
    And the Step Function should complete with enhanced monitoring
