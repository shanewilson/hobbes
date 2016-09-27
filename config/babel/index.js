const path = require('path');

const relayPlugin = path.join(__dirname, 'plugins', 'relayPlugin');

let plugins = [
  'transform-export-extensions',
];

const testPlugins = [
  'transform-es2015-modules-commonjs',
];

switch(process.env.BABEL_ENV) {
  case 'development':
    plugins = [
      ...plugins,
      relayPlugin,
      'react-hot-loader/babel',
    ];
    break;
  case 'stage':
  case 'production':
    plugins = [
      ...plugins,
      relayPlugin,
    ];
    break;
  case 'test':
    switch(process.env.TEST_ENV) {
      case 'single':
        plugins = [
          ...plugins,
          testPlugins,
          relayPlugin,
        ];
        break;
      case 'watch':
        plugins = [
          ...plugins,
          testPlugins,
        ];
      }
}

module.exports = {
  babelrc: false,
  presets: [
    'react-app',
    ['es2015', { modules: false, loose: true }],
  ],
  plugins,
};

