const path = require('path');

const webpackConfig = require(path.resolve(__dirname, '..', 'webpack', '_base'));

module.exports = () => {
  const jestConfig = {
    cacheDirectory: '.jest',
    collectCoverageFrom: [
      'src/js/*.js',
    ],
    moduleFileExtensions: webpackConfig.resolve.extensions,
    moduleDirectories: webpackConfig.resolve.modules,
    moduleNameMapper: Object.assign({}, {
      '^[./a-zA-Z0-9$_-]+\\.(jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm)$': path.resolve(__dirname, 'fileMock.js'),
      '^[./a-zA-Z0-9$_-]+\\.css$': path.resolve(__dirname, 'styleMock.js'),
    },
    webpackConfig.resolve.alias),
    scriptPreprocessor: path.resolve(__dirname, 'transform.js'),
    testPathIgnorePatterns: ['<rootDir>/(build|docs|node_modules)/'],
    testEnvironment: 'jsdom',
    testRegex: '/__tests__/.+\\.js$',
  };

  return jestConfig;
};
