'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _gracefulFs = require('graceful-fs');

var _gracefulFs2 = _interopRequireDefault(_gracefulFs);

var _ = require('../');

var _2 = _interopRequireDefault(_);

var _babel = require('../babel');

var _babel2 = _interopRequireDefault(_babel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getDirectories = srcpath => _gracefulFs2.default.readdirSync(srcpath).filter(file => _gracefulFs2.default.statSync(_path2.default.join(srcpath, file)).isDirectory());

const dirs = getDirectories(_path2.default.resolve(_path2.default.join(_2.default.get('dir_src'), 'js')));

const alias = dirs.reduce((acc, d) => _extends({}, acc, {
  [d]: _path2.default.resolve(_path2.default.join(_2.default.get('dir_src'), 'js', d))
}), {});

exports.default = {
  target: 'web',
  devtool: '#source-map',
  entry: {
    bundle: [_path2.default.join(_2.default.get('dir_src'), 'js', 'index.jsx')]
  },
  output: {
    path: _path2.default.join(_2.default.get('dir_dist'), _2.default.get('globals').__BASE__, 'js'),
    pathInfo: true,
    publicPath: _path2.default.join('/', _2.default.get('globals').__BASE__, 'js/'),
    filename: 'bundle.js'
  },
  module: {
    preLoaders: [],
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      exclude: ['node_modules'],
      include: `${ _2.default.get('dir_src') }/js`,
      query: _babel2.default
    }, {
      test: /\.json$/,
      loader: 'json'
    }],
    noParse: [/\.min\.js$/]
  },
  resolve: {
    extentions: ['', '.js', '.jsx'],
    modules: ['node_modules'],
    alias: _extends({
      react: _path2.default.resolve(_path2.default.join(_2.default.get('path_project'), 'node_modules', 'react'))
    }, alias)
  },
  plugins: [new _webpack2.default.DefinePlugin({
    'process.env': _2.default.get('globals')['process.env'],
    __API__: JSON.stringify(_2.default.get('globals').__API__),
    __DEV__: JSON.stringify(_2.default.get('globals').__DEV__),
    __PROD__: JSON.stringify(_2.default.get('globals').__PROD__),
    __DEBUG__: JSON.stringify(_2.default.get('globals').__DEBUG__),
    __BASE__: JSON.stringify(_2.default.get('globals').__BASE__)
  })]
};
module.exports = exports['default'];