'use strict';

require('babel-register');
var config = require('./config/index').default;
module.exports = require('./config/webpack/' + config.get('globals').NODE_ENV).default;