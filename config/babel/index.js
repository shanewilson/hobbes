const path = require('path');

const relayPlugin = path.join(__dirname, 'plugins', 'relayPlugin');

const commonPlugins = [
  ['transform-runtime', {
    helpers: false,
    polyfill: false,
    regenerator: true,
  }],
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
    single: { plugins: [...commonPlugins, relayPlugin] },
    watch: { plugins: commonPlugins },
    ci: {
      plugins: [
        ...commonPlugins,
        relayPlugin,
        'istanbul',
      ],
    },
  },
};
