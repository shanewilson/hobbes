#!/usr/bin/env babel-node
'use strict';

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _webpackDevServer = require('./bin/webpackDevServer');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const host = _config2.default.get('webpack_host');
const port = _config2.default.get('webpack_port');

_webpackDevServer2.default.listen(port, host, () => {
  console.log(`⚡  Server running at ${ _chalk2.default.white(`${ host }:${ port }`) }`);
  console.log(`➾  Proxying ${ _chalk2.default.white('/api') } to API running at ${ _chalk2.default.white(_config2.default.get('proxy')) }`);
});