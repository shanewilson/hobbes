'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ = require('..');

var _2 = _interopRequireDefault(_);

var _development = require('../webpack/development');

var _development2 = _interopRequireDefault(_development);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const KARMA_ENTRY_FILE = 'karma.entry.js';

exports.default = config => {
  config.set({
    browsers: ['Chrome_with_debugging'],

    customLaunchers: {
      Chrome_with_debugging: {
        base: 'Chrome',
        chromeDataDir: _path2.default.resolve(_2.default.get('path_project'), '.chrome'),
        flags: ['--remote-debugging-port=9222']
      }
    },
    // karma only needs to know about the test bundle
    files: [
    // 'node_modules/babel-polyfill/dist/polyfill.js',
    KARMA_ENTRY_FILE],
    // run the bundle through the webpack and sourcemap plugins
    preprocessors: {
      [KARMA_ENTRY_FILE]: ['webpack', 'sourcemap']
    },
    frameworks: ['chai-sinon', 'mocha'],
    reporters: ['mocha'],
    mochaReporter: {
      showDiff: true
    },
    plugins: ['karma-chrome-launcher', 'karma-chai-sinon', 'karma-mocha', 'karma-mocha-reporter', 'karma-sourcemap-loader', 'karma-webpack'],
    colors: true,

    // level of logging
    // possible values:
    // LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    webpack: _extends({}, _development2.default, {
      devtool: 'inline-source-map',
      externals: {
        cheerio: 'window',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
      }
    }),
    webpackMiddleware: _extends({}, _development2.default.devServer, {
      quiet: true
    })
  });

  return config;
};

module.exports = exports['default'];