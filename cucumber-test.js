module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'node_modules/aws-testing-framework/dist/steps/step-function-steps.js',
      'src/steps/debug-steps.ts'
    ],
    format: ['progress'],
    formatOptions: { snippetInterface: 'async-await' },
    paths: ['features/simple-test.feature']
  }
}; 