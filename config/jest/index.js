const path = require('path');

module.exports = () => {
  const jestConfig = {
    cacheDirectory: '.jest',
    collectCoverageFrom: [
      'src/js/**/*.js',
    ],
    moduleNameMapper: {
      '^[./a-zA-Z0-9$_-]+\\.(jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm)$': path.resolve(__dirname, 'fileMock.js'),
      '^[./a-zA-Z0-9$_-]+\\.css$': path.resolve(__dirname, 'styleMock.js'),
    },
    scriptPreprocessor: path.resolve(__dirname, 'transform.js'),
    testEnvironment: 'jsdom',

    // These settings are needed because we are putting our source code
    // under /node_modules/ which is normally ignored by default
    testPathDirs: ['src/js/node_modules'],
    coveragePathIgnorePatterns: [],
    preprocessorIgnorePatterns: [],
    testPathIgnorePatterns: [],
    haste: {
      providesModuleNodeModules: ['.*'],
    },
  };

  return jestConfig;
};
