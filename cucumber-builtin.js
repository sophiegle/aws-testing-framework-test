module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'features/step_definitions/framework-support.ts',
      'src/steps/step-function-execution-steps.ts',
      'node_modules/aws-testing-framework/dist/cucumber-support.js',
      'node_modules/aws-testing-framework/dist/framework/steps/S3Steps.js',
      'node_modules/aws-testing-framework/dist/framework/steps/LambdaSteps.js',
      'node_modules/aws-testing-framework/dist/framework/steps/SQSSteps.js',
      'node_modules/aws-testing-framework/dist/framework/steps/StepFunctionSteps.js'
      // The helper step in src/steps/step-function-execution-steps.ts captures the execution ARN
      // when Step Functions are triggered automatically, then we use the framework's built-in step
    ],
    format: [
      'progress',
      'html:reports/cucumber-report.html',
      'allure-cucumberjs/reporter'
    ],
    formatOptions: { 
      snippetInterface: 'async-await',
      resultsDir: 'allure-results'
    },
    paths: ['features/builtin-methods.feature']
  }
}; 