// inside that file
import chalk from 'chalk';
import babelRelayPlugin from 'babel-relay-plugin';
import config from '../../';

try {
  const schema = require(`${config.get('path_project')}/data/schema.json`);
  console.log(`⇅  Loading ${chalk.white('GraphQL schema')} into ${chalk.white('Relay')}`);
  module.exports = babelRelayPlugin(schema.data, {
    abortOnError: !config.get('globals').__DEV__,
  });
} catch (e) {
  console.log(`${chalk.red('✗')}  Failed to find schema`);
  console.log(`➾  Start the ${chalk.white('GraphQL')} server and run ${chalk.cyan('`make schema`')}`);
}
