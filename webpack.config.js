const path = require('path');

const isDevelopment = process.env.NODE_ENV === 'development';

/** メインプロセス用設定 */
/** @type import('webpack').Configuration */
const main = {
  target: 'electron-main',
  mode: isDevelopment ? 'development' : 'production',
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
  entry: {
    main: './src/ts/main.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dest', 'js'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devtool: isDevelopment ? 'inline-source-map' : false,
};

/** レンダラープロセス用設定 */
/** @type import('webpack').Configuration */
const renderer = {
  target: 'electron-renderer',
  mode: isDevelopment ? 'development' : 'production',
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
  entry: {
    renderer: './src/ts/renderer.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dest', 'js'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devtool: isDevelopment ? 'inline-source-map' : false,
};

module.exports = [main, renderer];