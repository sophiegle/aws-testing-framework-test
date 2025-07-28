module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'node_modules/aws-testing-framework/dist/steps/s3-steps.js',
      'node_modules/aws-testing-framework/dist/steps/lambda-steps.js',
      'node_modules/aws-testing-framework/dist/steps/step-function-steps.js',
      'node_modules/aws-testing-framework/dist/steps/sqs-steps.js',
      'node_modules/aws-testing-framework/dist/steps/correlation-steps.js',
      'node_modules/aws-testing-framework/dist/steps/monitoring-steps.js',
      'src/steps/feature-only-steps.ts'
    ],
    format: ['progress', 'html:reports/cucumber-report.html'],
    formatOptions: { snippetInterface: 'async-await' },
    paths: ['features/feature-only.feature']
  }
}; 