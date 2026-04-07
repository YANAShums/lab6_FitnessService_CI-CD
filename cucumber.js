module.exports = {
  default: [
    '--require features/step_definitions/**/*.js',
    '--format summary',
    '--format allure-cucumberjs/reporter',
    '--format html:report.html',
    'features/**/*.feature'
  ].join(' ')
};
