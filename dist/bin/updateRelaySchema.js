#!/usr/bin/env babel-node
'use strict';

var _gracefulFs = require('graceful-fs');

var _gracefulFs2 = _interopRequireDefault(_gracefulFs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utilities = require('graphql/utilities');

var _syncRequest = require('sync-request');

var _syncRequest2 = _interopRequireDefault(_syncRequest);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiUrl = _config2.default.get('proxy');
var graphqlHubUrl = apiUrl + '/graphql';
console.log('⚡  Fetching GraphQL Schema from ' + _chalk2.default.white(graphqlHubUrl));
try {
  var status = (0, _syncRequest2.default)('GET', apiUrl + '/status');
  var response = (0, _syncRequest2.default)('POST', graphqlHubUrl, {
    json: {
      query: _utilities.introspectionQuery
    }
  });

  if (response.statusCode === 200) {
    var schema = JSON.parse(response.body.toString('utf-8'));
    var version = JSON.parse(status.body.toString('utf-8'));

    _gracefulFs2.default.writeFileSync(_path2.default.join(_config2.default.get('path_project'), 'data', 'schema.json'), JSON.stringify(schema, null, 2));
    _gracefulFs2.default.writeFileSync(_path2.default.join(_config2.default.get('path_project'), 'data', 'version.json'), JSON.stringify(version, null, 2));
    console.log(_chalk2.default.green('✓') + '  GraphQL Schema ' + _chalk2.default.green('updated') + ' to commit ' + _chalk2.default.white(version.commit));
  } else {
    console.log(_chalk2.default.red('✗') + '  Failed to update schema');
    console.log(response);
  }
} catch (e) {
  console.log(_chalk2.default.red('✗') + '  ' + e);
}