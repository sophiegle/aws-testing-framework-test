Feature: Feature-Only Testing
  As a developer
  I want to test AWS workflows using only feature files
  So that I can write tests without custom step definitions

  Background:
    Given I have a feature-only S3 bucket named "awstestingframeworkinfrastructu-aftibucket816930f0-eebqmqrjqual"
    And I have a feature-only Lambda function named "afti-lambda-function"
    And I have a feature-only Step Function named "AftiStateMachineC1791690-QAqGBKOfbfLM"

  Scenario: Test simple S3 to Lambda workflow
    When I upload a feature-only file "simple-test.json" with content '{"simple": "test"}' to the S3 bucket
    Then the feature-only Lambda function should be invoked
    And the feature-only Lambda function should process the file successfully

  Scenario: Test file processing workflow
    When I upload a feature-only file "process-test.json" with content '{"process": "test"}' to the S3 bucket
    Then the feature-only file should be processed by the Lambda function
    And the feature-only processing should complete without errors
    And the feature-only results should be available in the S3 bucket

  Scenario: Test Lambda execution counting
    When I upload many feature-only files to the S3 bucket
    Then the feature-only Lambda function should be invoked 10 times within 10 minutes

  Scenario: Test error handling workflow
    When I upload a feature-only file "error-test.json" with content "invalid content" to the S3 bucket
    Then the feature-only Lambda function should handle the error gracefully
    And the feature-only error should be logged appropriately
    And the feature-only system should continue to function normally 