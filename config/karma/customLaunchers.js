// Browsers to run on Sauce Labs
// Check out https://saucelabs.com/platforms for all browser/OS combos
module.exports = {
  SL_Chrome_OSX: {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'latest',
    platform: 'OS X 10.11',
  },
  SL_Firefox_OSX: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'latest',
    platform: 'OS X 10.11',
  },
  SL_Safari_OSX: {
    base: 'SauceLabs',
    browserName: 'safari',
    version: 'latest',
    platform: 'OS X 10.11',
  },
  SL_Chrome_Linux: {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'latest',
    platform: 'Linux',
  },
  SL_Firefox_Linux: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'latest',
    platform: 'Linux',
  },
  SL_Chrome_Windows_10: {
    base: 'SauceLabs',
    browserName: 'chrome',
    version: 'latest',
    platform: 'Windows 10',
  },
  SL_Firefox_Windows_10: {
    base: 'SauceLabs',
    browserName: 'firefox',
    version: 'latest',
    platform: 'Windows 10',
  },
  SL_IE_11_Windows_10: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    version: '11',
    platform: 'Windows 10',
  },
  SL_Edge_Windows_10: {
    base: 'SauceLabs',
    browserName: 'microsoftedge',
    version: '13',
    platform: 'Windows 10',
  },
};
