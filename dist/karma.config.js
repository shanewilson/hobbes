'use strict';

require('babel-register');

const config = require('./config');
module.exports = require(`./config/karma/${ config.get('globals').TEST_ENV || 'single' }`);