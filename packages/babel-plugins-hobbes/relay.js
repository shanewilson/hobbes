// inside that file
const chalk = require('chalk');
const babelRelayPlugin = require('babel-relay-plugin');
const config = require('hobbes');

try {
  const schema = require(`${config.get('path_project')}/data/schema.json`);
  console.log(`\n⇅  Loading ${chalk.white('GraphQL schema')} into ${chalk.white('Relay')}`);
  module.exports = babelRelayPlugin(schema.data, {
    abortOnError: process.env.TEST_ENV === 'single',
  });
} catch (e) {
  console.log(`${chalk.red('✗')}  Failed to find schema`);
  console.log(`➾  Start the ${chalk.white('GraphQL')} server and run ${chalk.cyan('`make schema`')}`);
}
