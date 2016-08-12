import path from 'path';
import webpack from 'webpack';
import fs from 'graceful-fs';

import config from '../';
import babel from '../babel';

const getDirectories = srcpath => (
  fs.readdirSync(srcpath).filter(file => (
    fs.statSync(path.join(srcpath, file)).isDirectory()
  ))
);

const dirs = getDirectories(path.resolve(path.join(config.get('dir_src'), 'js')));

const alias = dirs.reduce((acc, d) => ({
  ...acc,
  [d]: path.resolve(path.join(config.get('dir_src'), 'js', d)),
}), {});

export default {
  target: 'web',
  devtool: '#source-map',
  entry: {
    bundle: ['babel-polyfill', path.join(config.get('dir_src'), 'js', 'index.jsx')],
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
        test: /\.jsx?$/,
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
    extentions: ['', '.js', '.jsx'],
    modules: ['node_modules'],
    alias: {
      react: path.resolve(path.join(config.get('path_project'), 'node_modules', 'react')),
      ...alias,
    },
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
