const path = require('path');

const relayPlugin = path.join(__dirname, 'plugins', 'relayPlugin');

const commonPlugins = [
  ['transform-runtime', {
    helpers: false,
    polyfill: false,
    regenerator: true,
  }],
];

const testPlugins = [
  'transform-es2015-modules-commonjs',
];

module.exports = {
  babelrc: false,
  presets: [
    'react',
    ['es2015', { modules: false, loose: true }],
    'stage-1',
  ],
  env: {
    development: {
      plugins: [
        ...commonPlugins,
        relayPlugin,
        'react-hot-loader/babel',
      ],
    },
    stage: { plugins: [...commonPlugins, relayPlugin] },
    production: { plugins: [
      ...commonPlugins,
      relayPlugin,
      'transform-react-constant-elements',
    ] },
    single: { plugins: [
      ...commonPlugins,
      testPlugins,
      relayPlugin,
    ] },
    watch: { plugins: [
      ...commonPlugins,
      testPlugins,
    ] },
    ci: {
      plugins: [
        ...commonPlugins,
        relayPlugin,
        'istanbul',
      ],
    },
  },
};
