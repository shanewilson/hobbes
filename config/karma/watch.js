export default config => {
  const base = require('./_base')(config);

  config.set({
    ...base,
    autoWatch: true,
    singleRun: false,
    mochaReporter: {
      ...config.mochaReporter,
      output: 'autowatch',
    },
  });

  return config;
};
