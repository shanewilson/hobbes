import path from 'path';

const relayPlugin = path.join(__dirname, 'plugins', 'relayPlugin');

const commonPlugins = [
  // function x(a, b, c,) { }
  'syntax-trailing-function-commas',
  // await fetch()
  'syntax-async-functions',
  // class { handleClick = () => { } }
  'transform-class-properties',
  // { ...todo, completed: true }
  'transform-object-rest-spread',
  // function* () { yield 42; yield 43; }
  'transform-regenerator',
  // Polyfills the runtime needed for async/await and generators
  ['transform-runtime', {
    helpers: false,
    polyfill: false,
    regenerator: true,
  }],
  // export v from 'mod';
  'transform-export-extensions',
];

export default {
  babelrc: false,
  presets: [
    'react',
    ['es2015', { modules: false }],
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
