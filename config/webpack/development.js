import webpack from 'webpack';

import config from '../';
import webpackConfig from './_base';

const devServer = {
  contentBase: config.get('dir_src'),
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false,
  },
  publicPath: webpackConfig.output.publicPath,
};

export default {
  ...webpackConfig,
  entry: {
    ...webpackConfig.entry,
    bundle: [
      `${config.get('fdt_modules')}/webpack-hot-middleware/client?reload=true`,
      'react-hot-loader/patch',
      ...webpackConfig.entry.bundle,
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    ...webpackConfig.plugins,
  ],
  devServer,
};
