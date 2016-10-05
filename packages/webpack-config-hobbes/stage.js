const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlRemove = require('./plugins/html-remove');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('@shanewilson/hobbes-config');
const webpackConfig = require('./_base');

const LIBS_BUNDLE = 'libs';

module.exports = merge(webpackConfig, {
  entry: {
    [LIBS_BUNDLE]: config.get('dependencies'),
  },
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[id].js',
  },
  plugins: [
    ...webpackConfig.plugins,
    new webpack.optimize.CommonsChunkPlugin(LIBS_BUNDLE),
    new webpack.optimize.AggressiveMergingPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(path.join(config.get('dir_packages'), 'root', 'index.html')),
      filename: '../index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true,
      },
    }),
    new HtmlRemove(),
  ],
});
