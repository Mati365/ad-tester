const sharedConfig = require('./config.shared.js')();

module.exports = {
  ...sharedConfig,
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      ...sharedConfig.module.rules,
    ],
  },
};
