'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _htmlRemove = require('./plugins/html-remove');

var _htmlRemove2 = _interopRequireDefault(_htmlRemove);

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

var _ = require('../');

var _2 = _interopRequireDefault(_);

var _base = require('./_base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LIBS_BUNDLE = 'libs';

exports.default = _extends({}, _base2.default, {
  entry: _extends({}, _base2.default.entry, _defineProperty({}, LIBS_BUNDLE, _2.default.get('dependencies'))),
  output: _extends({}, _base2.default.output, {
    filename: '[name].[hash].js',
    chunkFilename: '[id].js'
  }),
  plugins: [].concat(_toConsumableArray(_base2.default.plugins), [new _webpack2.default.optimize.CommonsChunkPlugin(LIBS_BUNDLE), new _webpack2.default.optimize.AggressiveMergingPlugin(), new _htmlWebpackPlugin2.default({
    template: _path2.default.resolve(_path2.default.join(_2.default.get('path_project'), 'src', 'index.html')),
    filename: '../index.html',
    inject: 'body',
    minify: {
      collapseWhitespace: true
    }
  }), new _htmlRemove2.default()])
});
module.exports = exports['default'];