'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _ = require('../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelRelayPlugin = _path2.default.join(__dirname, 'plugins', 'babelRelayPlugin');

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
      include: _2.default.get('dir_src') + '/js',
      query: {
        presets: ['react', ['es2015', { modules: false }], 'stage-0'],
        env: {
          development: {
            plugins: [babelRelayPlugin, 'react-hot-loader/babel']
          },
          stage: { plugins: [babelRelayPlugin] },
          production: { plugins: [babelRelayPlugin] },
          single: { plugins: [babelRelayPlugin] },
          watch: { plugins: [] },
          ci: {
            plugins: [babelRelayPlugin, 'istanbul']
          }
        }
      }
    }, {
      test: /\.json$/,
      loader: 'json'
    }],
    noParse: [/\.min\.js$/]
  },
  resolve: {
    extentions: ['', '.js', '.jsx'],
    modules: ['node_modules'],
    alias: {
      react: _path2.default.resolve(_path2.default.join(_2.default.get('path_project'), 'node_modules', 'react')),
      routes: _path2.default.resolve(_path2.default.join(_2.default.get('dir_src'), 'js', 'routes')),
      components: _path2.default.resolve(_path2.default.join(_2.default.get('dir_src'), 'js', 'components')),
      containers: _path2.default.resolve(_path2.default.join(_2.default.get('dir_src'), 'js', 'containers')),
      mutations: _path2.default.resolve(_path2.default.join(_2.default.get('dir_src'), 'js', 'mutations'))
    }
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