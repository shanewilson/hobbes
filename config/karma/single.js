module.exports = config => {
  const base = require('./_base')(config);

  config.set(Object.assign(base, {
    autoWatch: false,
    singleRun: true,
    mochaReporter: Object.assign(base.mochaReporter, {
      output: 'minimal',
    }),
  }));

  return config;
};
