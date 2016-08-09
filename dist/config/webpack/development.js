'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _caseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');

var _caseSensitivePathsWebpackPlugin2 = _interopRequireDefault(_caseSensitivePathsWebpackPlugin);

var _ = require('../');

var _2 = _interopRequireDefault(_);

var _base = require('./_base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const devServer = {
  contentBase: _2.default.get('dir_src'),
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false
  },
  publicPath: _base2.default.output.publicPath
};

exports.default = _extends({}, _base2.default, {
  entry: _extends({}, _base2.default.entry, {
    bundle: ['webpack-hot-middleware/client?reload=true', 'react-hot-loader/patch', ..._base2.default.entry.bundle]
  }),
  plugins: [new _caseSensitivePathsWebpackPlugin2.default(), new _webpack2.default.HotModuleReplacementPlugin(), ..._base2.default.plugins],
  devServer
});
module.exports = exports['default'];