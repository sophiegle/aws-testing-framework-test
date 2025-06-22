module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'src/steps/custom-steps.ts'
    ],
    format: ['progress', 'html:reports/cucumber-report.html'],
    formatOptions: { snippetInterface: 'async-await' },
    paths: ['features/custom-steps.feature'],
    timeout: 60000
  }
}; 