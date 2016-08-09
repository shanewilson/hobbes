import webpack from 'webpack';
import CompressionPlugin from 'compression-webpack-plugin';

import webpackConfig from './stage';

export default {
  ...webpackConfig,
  bail: true,
  debug: false,
  profile: false,
  pathInfo: false,
  output: {
    ...webpackConfig.output,
    pathInfo: false,
  },
  plugins: [
    ...webpackConfig.plugins,
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      // algorithm: 'gzip',
      test: /\.js$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
};
