const path = require('path');
const express = require('express');
const proxy = require('express-http-proxy');
const gzipStatic = require('connect-gzip-static');
const webpack = require('webpack');

const config = require('hobbes-config');
const webpackConfig = require('webpack-config-hobbes');

const app = express();

const isDevelopment = config.get('env').NODE_ENV === 'development';
const staticDir = config.get(isDevelopment ? 'dir_packages' : 'dir_dist');
const indexFile = path.join(isDevelopment ? 'root' : config.get('globals').__BASE__, 'index.html');

app.use(gzipStatic(staticDir));

if (isDevelopment) {
  const compiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(compiler, webpackConfig.devServer));
  app.use(require('webpack-hot-middleware')(compiler));

  console.log('⌛  Webpack bundling assets for the first time...');
}

app.use('/api', proxy(config.get('proxy'), {
  forwardPath: req => (
    require('url').parse(req.url).path
  ),
}));

app.get(/^((?!(.js|.css|.ico)).)*$/, (req, res) => {
  res.sendFile(path.join(staticDir, indexFile));
});

module.exports = app;
