'use strict';

require('babel-register');

var config = require('./config').default;
module.exports = require('./config/karma/' + config.get('globals').TEST_ENV || 'single').default;