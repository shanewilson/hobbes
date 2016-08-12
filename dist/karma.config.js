'use strict';

require('babel-register');
var config = require('./config');

module.exports = require('./config/karma/' + (config.get('globals').TEST_ENV || 'single'));