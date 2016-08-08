#!/usr/bin/env babel-node
'use strict';

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _webpackDevServer = require('./bin/webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var host = _config2.default.get('webpack_host');
var port = _config2.default.get('webpack_port');

_webpackDevServer2.default.listen(port, host, function () {
  console.log('⚡  Server running at ' + _chalk2.default.white(host + ':' + port));
  console.log('➾  Proxying ' + _chalk2.default.white('/api') + ' to API running at ' + _chalk2.default.white(_config2.default.get('proxy')));
});