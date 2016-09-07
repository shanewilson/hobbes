const jestConfig = require('../config/jest');
const jest = require('jest');

const argv = ['--config', JSON.stringify(jestConfig())];

if (process.env.TEST_ENV === 'watch') {
  argv.push('--watch');
  argv.push('-o');
}

jest.run(argv);
