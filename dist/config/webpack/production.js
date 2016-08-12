'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _compressionWebpackPlugin = require('compression-webpack-plugin');

var _compressionWebpackPlugin2 = _interopRequireDefault(_compressionWebpackPlugin);

var _stage = require('./stage');

var _stage2 = _interopRequireDefault(_stage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = _extends({}, _stage2.default, {
  bail: true,
  debug: false,
  profile: false,
  pathInfo: false,
  output: _extends({}, _stage2.default.output, {
    pathInfo: false
  }),
  plugins: [].concat(_toConsumableArray(_stage2.default.plugins), [new _webpack2.default.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }), new _webpack2.default.optimize.DedupePlugin(), new _webpack2.default.optimize.UglifyJsPlugin({
    compress: {
      screw_ie8: true,
      warnings: false
    },
    mangle: {
      screw_ie8: true
    },
    output: {
      comments: false,
      screw_ie8: true
    }
  }), new _compressionWebpackPlugin2.default({
    asset: '[path].gz[query]',
    // algorithm: 'gzip',
    test: /\.js$|\.html$/,
    threshold: 10240,
    minRatio: 0.8
  })])
});
module.exports = exports['default'];