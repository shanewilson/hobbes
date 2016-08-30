const config = require('../');
const customLaunchers = require('./customLaunchers');

module.exports = karmaConfig => {
  const single = require('./single')(karmaConfig);

  karmaConfig.set(Object.assign({}, single, {
    logLevel: karmaConfig.LOG_ERROR,
    // Increase timeout in case connection in CI is slow
    captureTimeout: 120000,
    browserNoActivityTimeout: 30000,
    customLaunchers,
    browsers: Object.keys(customLaunchers),
    reporters: [
      ...single.reporters,
      'coverage',
      'saucelabs',
    ],
    plugins: [
      ...single.plugins,
      'karma-sauce-launcher',
      'karma-coverage',
    ],
    sauceLabs: {
      testName: 'Unit Tests',
      tags: ['unit'],
      recordScreenshots: false,
      recordVideo: false,
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      build: `${process.env.TRAVIS_REPO_SLUG}:${process.env.TRAVIS_BUILD_NUMBER}`,
      startConnect: false,
      connectOptions: {
        port: 5757,
        logfile: 'sauce_connect.log',
      },
    },
    coverageReporter: {
      dir: `${config.get('path_project')}/coverage`,
      reporters: [
        { type: 'lcov', subdir: '.', file: 'lcov.info' },
      ],
    },
  }));

  return karmaConfig;
};
