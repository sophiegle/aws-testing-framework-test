Feature: Simple AWS Testing Framework Test
  As a developer
  I want to test basic AWS Testing Framework functionality
  So that I can verify the framework works with the latest version

  Background:
    Given I have an S3 bucket named "awstestingframeworkinfrastructu-aftibucket816930f0-eebqmqrjqual"
    And I have a Lambda function named "afti-lambda-function"
    And I have a Step Function named "AftiStateMachineC1791690-QAqGBKOfbfLM"

  Scenario: Test basic S3 upload
    When I upload a file "simple-test.json" with content '{"test": "data"}' to the S3 bucket
    Then the S3 bucket should contain the file "simple-test.json"

  Scenario: Test basic Lambda invocation
    When I upload a file "lambda-test.json" with content '{"test": "payload"}' to the S3 bucket
    Then the Lambda function should be invoked

  Scenario: Test basic Step Function verification
    When I upload a file "step-function-test.json" with content '{"test": "input"}' to the S3 bucket
    Then the Step Function should be executed

  Scenario: Test Lambda execution counting
    When I upload multiple files to the S3 bucket
    Then the Lambda function should be invoked 3 times within 5 minutes 