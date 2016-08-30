const path = require('path');

const config = require('..');
const webpack = require('../webpack/development');

const KARMA_ENTRY_FILE = 'karma.entry.js';

module.exports = karmaConfig => {
  karmaConfig.set({
    browsers: ['Chrome_with_debugging'],

    customLaunchers: {
      Chrome_with_debugging: {
        base: 'Chrome',
        chromeDataDir: path.resolve(config.get('path_project'), '.chrome'),
        flags: [
          '--remote-debugging-port=9222',
        ],
      },
    },
    // karma only needs to know about the test bundle
    files: [
      path.resolve(config.get('path_project'), 'node_modules/babel-polyfill/dist/polyfill.js'),
      KARMA_ENTRY_FILE,
    ],
    // run the bundle through the webpack and sourcemap plugins
    preprocessors: {
      [KARMA_ENTRY_FILE]: ['webpack', 'sourcemap'],
    },
    frameworks: ['chai-sinon', 'mocha'],
    reporters: ['mocha'],
    mochaReporter: {
      showDiff: true,
    },
    plugins: [
      'karma-chrome-launcher',
      'karma-chai-sinon',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-sourcemap-loader',
      'karma-webpack',
    ],
    colors: true,

    // level of logging
    // possible values:
    // LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: karmaConfig.LOG_INFO,

    webpack: Object.assign({}, webpack, {
      devtool: 'inline-source-map',
      externals: {
        cheerio: 'window',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true,
      },
    }),
    webpackMiddleware: Object.assign({}, webpack.devServer, {
      quiet: true,
    }),
  });

  return karmaConfig;
};
