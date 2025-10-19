module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'features/step_definitions/framework-support.ts',
      'src/steps/extend-steps.ts'
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
    paths: ['features/extend-steps.feature']
  }
}; 