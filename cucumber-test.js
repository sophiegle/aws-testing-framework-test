module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'node_modules/aws-testing-framework/dist/cucumber-support.js',
      'node_modules/aws-testing-framework/dist/framework/steps/S3Steps.js',
      'node_modules/aws-testing-framework/dist/framework/steps/LambdaSteps.js',
      'node_modules/aws-testing-framework/dist/framework/steps/SQSSteps.js',
      'node_modules/aws-testing-framework/dist/framework/steps/StepFunctionSteps.js'
    ],
    format: ['progress'],
    formatOptions: { snippetInterface: 'async-await' },
    paths: ['features/simple-test.feature']
  }
}; 