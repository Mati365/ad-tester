const sharedConfig = require('./config.shared.js')();

module.exports = {
  ...sharedConfig,
  watch: true,
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      ...sharedConfig.module.rules,
    ],
  },
};
