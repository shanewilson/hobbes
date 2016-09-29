const chalk = require('chalk');
const config = require('./packages/hobbes');
const devServer = require('./packages/hobbes-scripts/webpackDevServer');

const host = config.get('webpack_host');
const port = config.get('webpack_port');

devServer.listen(port, host, () => {
  console.log(`⚡  Server running at ${chalk.white(`${host}:${port}`)}`);
  console.log(`➾  Proxying ${chalk.white('/api')} to API running at ${chalk.white(config.get('proxy'))}`);
});
