// inside that file
import chalk from 'chalk';
import babelRelayPlugin from 'babel-relay-plugin';
import config from '../../';
const schema = require(`${config.get('path_project')}/data/schema.json`);

console.log(`⇅  Loading ${chalk.white('GraphQL schema')} into ${chalk.white('Relay')}`);

module.exports = babelRelayPlugin(schema.data, {
  abortOnError: !config.get('globals').__DEV__,
});
