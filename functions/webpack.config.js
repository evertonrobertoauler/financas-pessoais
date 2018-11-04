const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: { index: './src/index.ts' },
  resolve: { extensions: ['.ts', '.js'] },
  target: 'node',
  externals: [nodeExternals()],
  output: { path: path.join(__dirname, 'lib'), filename: '[name].js', libraryTarget: 'this' },
  module: { rules: [{ test: /\.ts$/, loader: 'ts-loader' }] },
  devtool: 'source-map',
  optimization: { minimize: false },
  node: { __dirname: false }
};
