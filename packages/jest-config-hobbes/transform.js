const babelConfig = require('babel-preset-hobbes');
const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer(babelConfig);
