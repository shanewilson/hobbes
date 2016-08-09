'use strict';

// config object cannot be used here =(
// PWD and __dirname seem to be undefined
const context = require.context('../../../src/js', true, /.+\.js$/);
context.keys().forEach(context);
module.exports = context;