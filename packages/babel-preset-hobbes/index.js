const path = require('path');
const readPkgUp = require('read-pkg-up');

const pkg = readPkgUp.sync().pkg;

const relayPlugin = !!pkg.dependencies['react-relay']
  ? [require('@shanewilson/babel-plugins-hobbes/relay')]
  : [];

let plugins = [
  'transform-export-extensions',
];

const testPlugins = [
  'transform-es2015-modules-commonjs',
];

switch (process.env.BABEL_ENV || process.env.NODE_ENV) {
  case 'development':
    plugins = [
      ...plugins,
      ...relayPlugin,
      'react-hot-loader/babel',
    ];
    break;
  case 'stage':
  case 'production':
    plugins = [
      ...plugins,
      ...relayPlugin,
    ];
    break;
  case 'test':
    switch (process.env.TEST_ENV) {
      case 'single':
        plugins = [
          ...plugins,
          testPlugins,
          ...relayPlugin,
        ];
        break;
      case 'watch':
        plugins = [
          ...plugins,
          testPlugins,
        ];
        break;
      default:
        break;
    }
    break;
  default:
    break;
}

module.exports = {
  babelrc: false,
  presets: [ // Order is important here
    ['latest', {
      es2015: { modules: false, loose: true },
    }],
    'react-app',
  ],
  plugins,
};

