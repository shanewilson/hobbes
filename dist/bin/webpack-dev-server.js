'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressHttpProxy = require('express-http-proxy');

var _expressHttpProxy2 = _interopRequireDefault(_expressHttpProxy);

var _connectGzipStatic = require('connect-gzip-static');

var _connectGzipStatic2 = _interopRequireDefault(_connectGzipStatic);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _webpack3 = require('../webpack.config');

var _webpack4 = _interopRequireDefault(_webpack3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var isDevelopment = _config2.default.get('env').NODE_ENV === 'development';
var staticDir = _config2.default.get(isDevelopment ? 'dir_src' : 'dir_dist');
var indexFile = _path2.default.join(isDevelopment ? '' : _config2.default.get('globals').__BASE__, 'index.html');

app.use((0, _connectGzipStatic2.default)(staticDir));

if (isDevelopment) {
  var compiler = (0, _webpack2.default)(_webpack4.default);

  app.use(require('webpack-dev-middleware')(compiler, _webpack4.default.devServer));
  app.use(require('webpack-hot-middleware')(compiler));

  console.log('⌛  Webpack bundling assets for the first time...');
}

app.use('/api', (0, _expressHttpProxy2.default)(_config2.default.get('proxy'), {
  forwardPath: function forwardPath(req) {
    return require('url').parse(req.url).path;
  }
}));

app.get(/^((?!(.js|.css|.ico)).)*$/, function (req, res) {
  res.sendFile(_path2.default.join(staticDir, indexFile));
});

exports.default = app;