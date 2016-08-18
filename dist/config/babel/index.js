'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var relayPlugin = _path2.default.join(__dirname, 'plugins', 'relayPlugin');

var commonPlugins = [['transform-runtime', {
  helpers: false,
  polyfill: false,
  regenerator: true
}]];

exports.default = {
  babelrc: false,
  presets: ['react', ['es2015', { modules: false, loose: true }], 'stage-1'],
  env: {
    development: {
      plugins: [].concat(commonPlugins, [relayPlugin, 'react-hot-loader/babel'])
    },
    stage: { plugins: [].concat(commonPlugins, [relayPlugin]) },
    production: { plugins: [].concat(commonPlugins, [relayPlugin, 'transform-react-constant-elements']) },
    single: { plugins: [].concat(commonPlugins, [relayPlugin]) },
    watch: { plugins: commonPlugins },
    ci: {
      plugins: [].concat(commonPlugins, [relayPlugin, 'istanbul'])
    }
  }
};
module.exports = exports['default'];