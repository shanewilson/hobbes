const babelConfig = require('../babel');
const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer(babelConfig);
