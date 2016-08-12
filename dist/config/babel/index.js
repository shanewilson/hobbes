'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const relayPlugin = _path2.default.join(__dirname, 'plugins', 'relayPlugin');

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
  regenerator: true
}]];

exports.default = {
  babelrc: false,
  presets: ['react', ['es2015', { modules: false }], 'es2016'],
  env: {
    development: {
      plugins: [...commonPlugins, relayPlugin, 'react-hot-loader/babel']
    },
    stage: { plugins: [...commonPlugins, relayPlugin] },
    production: { plugins: [...commonPlugins, relayPlugin, 'transform-react-constant-elements'] },
    single: { plugins: [...commonPlugins, relayPlugin] },
    watch: { plugins: commonPlugins },
    ci: {
      plugins: [...commonPlugins, relayPlugin, 'istanbul']
    }
  }
};
module.exports = exports['default'];