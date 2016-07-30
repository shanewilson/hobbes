#!/usr/bin/env babel-node

import chalk from 'chalk';
import config from './config';
import devServer from './bin/webpack-dev-server';

const host = config.get('webpack_host');
const port = config.get('webpack_port');

devServer.listen(port, host, () => {
  console.log(`⚡  Server running at ${chalk.white(`${host}:${port}`)}`);
  console.log(`➾  Proxying ${chalk.white('/api')} to API running at ${chalk.white(config.get('proxy'))}`);
});
