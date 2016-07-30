import path from 'path';
import configSettings from '../';

// Browsers to run on Sauce Labs
// Check out https://saucelabs.com/platforms for all browser/OS combos
export const customLaunchers = {
  SL_Chrome_OSX: {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'latest',
    platform: 'OS X 10.11',
  },
  SL_Firefox_OSX: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'latest',
    platform: 'OS X 10.11',
  },
  SL_Safari_OSX: {
    base: 'SauceLabs',
    browserName: 'safari',
    version: 'latest',
    platform: 'OS X 10.11',
  },
  SL_Chrome_Linux: {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'latest',
    platform: 'Linux',
  },
  SL_Firefox_Linux: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'latest',
    platform: 'Linux',
  },
  SL_Chrome_Windows_10: {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'latest',
    platform: 'Windows 10',
  },
  SL_Firefox_Windows_10: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'latest',
    platform: 'Windows 10',
  },
  SL_IE_11_Windows_10: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    version: '11',
    platform: 'Windows 10',
  },
  SL_Edge_Windows_10: {
    base: 'SauceLabs',
    browserName: 'microsoftedge',
    version: '13',
    platform: 'Windows 10',
  },
};

export default config => {
  const single = require('./single').default(config);

  config.set({
    ...single,
    logLevel: config.LOG_ERROR,
    // Increase timeout in case connection in CI is slow
    captureTimeout: 120000,
    browserNoActivityTimeout: 30000,
    customLaunchers,
    browsers: Object.keys(customLaunchers),
    reporters: [
      ...single.reporters,
      'coverage',
      'saucelabs'
    ],
    plugins: [
      ...single.plugins,
      'karma-sauce-launcher',
      'karma-coverage'
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
      dir: `${configSettings.get('path_project')}/coverage`,
      reporters: [
        { type: 'lcov', subdir: '.', file: 'lcov.info' },
      ],
    }
  });

  return config;
};
