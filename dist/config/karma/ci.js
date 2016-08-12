'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ = require('../');

var _2 = _interopRequireDefault(_);

var _customLaunchers = require('./customLaunchers');

var _customLaunchers2 = _interopRequireDefault(_customLaunchers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = config => {
  const single = require('./single')(config);

  config.set(_extends({}, single));

  return config;
};

module.exports = exports['default'];