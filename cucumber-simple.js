module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'node_modules/aws-testing-framework/dist/steps/s3-steps.js',
      'node_modules/aws-testing-framework/dist/steps/lambda-steps.js',
      'node_modules/aws-testing-framework/dist/steps/step-function-steps.js'
    ],
    format: ['progress', 'html:reports/cucumber-report.html'],
    formatOptions: { snippetInterface: 'async-await' },
    paths: ['features/simple-test.feature']
  }
}; 