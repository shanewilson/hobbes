'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ = require('../');

var _2 = _interopRequireDefault(_);

var _customLaunchers = require('./customLaunchers');

var _customLaunchers2 = _interopRequireDefault(_customLaunchers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = config => {
  const single = require('./single')(config);

  config.set(_extends({}, single, {
    logLevel: config.LOG_ERROR,
    // Increase timeout in case connection in CI is slow
    captureTimeout: 120000,
    browserNoActivityTimeout: 30000,
    customLaunchers: _customLaunchers2.default,
    browsers: Object.keys(_customLaunchers2.default),
    reporters: [...single.reporters, 'coverage', 'saucelabs'],
    plugins: [...single.plugins, 'karma-sauce-launcher', 'karma-coverage'],
    sauceLabs: {
      testName: 'Unit Tests',
      tags: ['unit'],
      recordScreenshots: false,
      recordVideo: false,
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      build: `${ process.env.TRAVIS_REPO_SLUG }:${ process.env.TRAVIS_BUILD_NUMBER }`,
      startConnect: false,
      connectOptions: {
        port: 5757,
        logfile: 'sauce_connect.log'
      }
    },
    coverageReporter: {
      dir: `${ _2.default.get('path_project') }/coverage`,
      reporters: [{ type: 'lcov', subdir: '.', file: 'lcov.info' }]
    }
  }));

  return config;
};

module.exports = exports['default'];