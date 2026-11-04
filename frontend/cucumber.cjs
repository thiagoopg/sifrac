/**
 * Cucumber Config — integração com Playwright + TypeScript
 */
module.exports = {
  default: {
    require: [
      'tests/bdd/cucumber-hooks.ts',
      'tests/bdd/step-definitions/*.steps.ts',
    ],
    requireModule: ['tsx/cjs'],
    format: ['progress', 'html:playwright-report/bdd-report.html'],
    publishQuiet: true,
    tags: 'not @skip',
  },
};
