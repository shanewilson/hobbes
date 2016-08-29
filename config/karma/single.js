module.exports = karmaConfig => {
  const base = require('./_base')(karmaConfig);

  karmaConfig.set(Object.assign(base, {
    autoWatch: false,
    singleRun: true,
    mochaReporter: Object.assign(base.mochaReporter, {
      output: 'minimal',
    }),
  }));

  return karmaConfig;
};
