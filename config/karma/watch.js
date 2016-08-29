module.exports = config => {
  const base = require('./_base')(config);

  config.set(Object.assign(base, {
    autoWatch: true,
    singleRun: false,
    mochaReporter: Object.assign(config.mochaReporter, {
      output: 'autowatch',
    }),
  }));

  return config;
};
