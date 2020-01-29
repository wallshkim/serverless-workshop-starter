// take everything starting at source index.js and bundle to push up to amazon
const path = require('path');
module.exports = {
  entry: './src/index.js',
  target: 'node',
  mode: 'none',
  module: {
    rules: [
    ],
  },
  resolve: {
    extensions: [ '.js' ],
  },
  output: {
    filename: 'bundle.js',
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, 'build'),
  },
};