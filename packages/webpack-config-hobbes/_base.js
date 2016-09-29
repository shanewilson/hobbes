const path = require('path');
const webpack = require('webpack');

const config = require('hobbes-config');
const babel = require('babel-preset-hobbes');

module.exports = {
  target: 'web',
  devtool: '#source-map',
  entry: {
    bundle: [path.join(config.get('dir_src'), 'js', 'index.js')],
  },
  output: {
    path: path.join(config.get('dir_dist'), config.get('globals').__BASE__, 'js'),
    pathInfo: true,
    publicPath: path.join('/', config.get('globals').__BASE__, 'js/'),
    filename: 'bundle.js',
  },
  module: {
    preLoaders: [],
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        exclude: ['node_modules'],
        include: `${config.get('dir_src')}/js`,
        query: babel,
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
    noParse: [/\.min\.js$/],
  },
  resolve: {
    extentions: ['', 'js', 'json'],
    modules: ['node_modules'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.get('globals')['process.env'],
      __API__: JSON.stringify(config.get('globals').__API__),
      __DEV__: JSON.stringify(config.get('globals').__DEV__),
      __PROD__: JSON.stringify(config.get('globals').__PROD__),
      __DEBUG__: JSON.stringify(config.get('globals').__DEBUG__),
      __BASE__: JSON.stringify(config.get('globals').__BASE__),
    }),
  ],
};
