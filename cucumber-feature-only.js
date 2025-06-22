module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'src/steps/feature-only-steps.ts'
    ],
    format: ['progress', 'html:reports/cucumber-report.html'],
    formatOptions: { snippetInterface: 'async-await' },
    paths: ['features/feature-only.feature']
  }
}; 