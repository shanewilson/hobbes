module.exports = karmaConfig => {
  const base = require('./_base')(karmaConfig);

  karmaConfig.set(Object.assign(base, {
    autoWatch: true,
    singleRun: false,
    mochaReporter: Object.assign(karmaConfig.mochaReporter, {
      output: 'autowatch',
    }),
  }));

  return karmaConfig;
};
