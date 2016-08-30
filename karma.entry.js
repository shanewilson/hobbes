// config object cannot be used here =(
// PWD and __dirname seem to be undefined
const context = require.context('../../src/js', true, /.+test.\.js$/);
context.keys().forEach(context);
module.exports = context;
