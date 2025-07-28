module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'src/steps/debug-steps.ts'
    ],
    format: ['progress'],
    formatOptions: { snippetInterface: 'async-await' },
    paths: ['features/simple-test.feature']
  }
}; 