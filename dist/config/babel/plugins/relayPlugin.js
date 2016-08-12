'use strict';

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _babelRelayPlugin = require('babel-relay-plugin');

var _babelRelayPlugin2 = _interopRequireDefault(_babelRelayPlugin);

var _ = require('../../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = require(_2.default.get('path_project') + '/data/schema.json'); // inside that file


console.log('⇅  Loading ' + _chalk2.default.white('GraphQL schema') + ' into ' + _chalk2.default.white('Relay'));

module.exports = (0, _babelRelayPlugin2.default)(schema.data, {
  abortOnError: !_2.default.get('globals').__DEV__
});