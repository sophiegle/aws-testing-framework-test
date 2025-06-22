module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'src/steps/extend-steps.ts'
    ],
    format: ['progress', 'html:reports/cucumber-report.html'],
    formatOptions: { snippetInterface: 'async-await' },
    paths: ['features/extend-steps.feature']
  }
}; 