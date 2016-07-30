export default config => {
  const base = require('./_base').default(config);

  config.set({
    ...base,
    autoWatch: false,
    singleRun: true,
    mochaReporter: {
      ...config.mochaReporter,
      output: 'minimal',
    },
  });

  return config;
};
