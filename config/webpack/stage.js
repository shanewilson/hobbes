import path from 'path';
import webpack from 'webpack';
import HtmlRemove from './plugins/html-remove';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import config from '../';
import webpackConfig from './_base';

const LIBS_BUNDLE = 'libs';

export default {
  ...webpackConfig,
  entry: {
    ...webpackConfig.entry,
    [LIBS_BUNDLE]: config.get('dependencies'),
  },
  output: {
    ...webpackConfig.output,
    filename: '[name].[hash].js',
    chunkFilename: '[id].js',
  },
  plugins: [
    ...webpackConfig.plugins,
    new webpack.optimize.CommonsChunkPlugin(LIBS_BUNDLE),
    new webpack.optimize.AggressiveMergingPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(path.join(config.get('path_project'), 'src', 'index.html')),
      filename: '../index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true,
      },
    }),
    new HtmlRemove(),
  ],
};
