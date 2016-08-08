'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.customLaunchers = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ = require('../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Browsers to run on Sauce Labs
// Check out https://saucelabs.com/platforms for all browser/OS combos
var customLaunchers = exports.customLaunchers = {
  SL_Chrome_OSX: {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'latest',
    platform: 'OS X 10.11'
  },
  SL_Firefox_OSX: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'latest',
    platform: 'OS X 10.11'
  },
  SL_Safari_OSX: {
    base: 'SauceLabs',
    browserName: 'safari',
    version: 'latest',
    platform: 'OS X 10.11'
  },
  SL_Chrome_Linux: {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'latest',
    platform: 'Linux'
  },
  SL_Firefox_Linux: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'latest',
    platform: 'Linux'
  },
  SL_Chrome_Windows_10: {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'latest',
    platform: 'Windows 10'
  },
  SL_Firefox_Windows_10: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'latest',
    platform: 'Windows 10'
  },
  SL_IE_11_Windows_10: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    version: '11',
    platform: 'Windows 10'
  },
  SL_Edge_Windows_10: {
    base: 'SauceLabs',
    browserName: 'microsoftedge',
    version: '13',
    platform: 'Windows 10'
  }
};

exports.default = function (config) {
  var single = require('./single').default(config);

  config.set(_extends({}, single, {
    logLevel: config.LOG_ERROR,
    // Increase timeout in case connection in CI is slow
    captureTimeout: 120000,
    browserNoActivityTimeout: 30000,
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    reporters: [].concat(_toConsumableArray(single.reporters), ['coverage', 'saucelabs']),
    plugins: [].concat(_toConsumableArray(single.plugins), ['karma-sauce-launcher', 'karma-coverage']),
    sauceLabs: {
      testName: 'Unit Tests',
      tags: ['unit'],
      recordScreenshots: false,
      recordVideo: false,
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
      build: process.env.TRAVIS_REPO_SLUG + ':' + process.env.TRAVIS_BUILD_NUMBER,
      startConnect: false,
      connectOptions: {
        port: 5757,
        logfile: 'sauce_connect.log'
      }
    },
    coverageReporter: {
      dir: _2.default.get('path_project') + '/coverage',
      reporters: [{ type: 'lcov', subdir: '.', file: 'lcov.info' }]
    }
  }));

  return config;
};