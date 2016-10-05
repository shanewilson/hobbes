const path = require('path');
const config = require('@shanewilson/hobbes-config');

module.exports = () => {
  const jestConfig = {
    cacheDirectory: '.jest',
    collectCoverageFrom: [
      `${config.get('dir_packages')}/**/*.js`,
    ],
    moduleNameMapper: {
      '^[./a-zA-Z0-9$_-]+\\.(jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm)$': path.resolve(__dirname, 'fileMock.js'),
      '^[./a-zA-Z0-9$_-]+\\.css$': path.resolve(__dirname, 'styleMock.js'),
    },
    scriptPreprocessor: path.resolve(__dirname, 'transform.js'),
    testEnvironment: 'jsdom',
    testPathDirs: [config.get('dir_packages')]
  };

  return jestConfig;
};
