const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const getSharedConfig = () => ({
  entry: {
    popup: './extension/src/js/popup.js',
    content: [
      '@babel/polyfill',
      './extension/src/js/content.js',
    ],
    background: [
      '@babel/polyfill',
      './extension/src/js/background.js',
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      path.resolve('./extension/src/js/'),
      'node_modules',
    ],
  },
  output: {
    path: path.resolve('./build/js'),
    filename: '[name].js',
  },
  plugins: [
    new CleanWebpackPlugin([
      path.resolve('./build'),
    ], {
      root: path.resolve('.'),
      verbose: true,
      dry: false,
    }),

    new CopyWebpackPlugin(
      [{
        from: path.resolve('./extension'),
        to: path.resolve('./build'),
        ignore: ['src/**/*'],
      }],
    ),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              '@babel/plugin-proposal-class-properties',
            ],
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
            ],
          },
        },
      },
    ],
  },
});

module.exports = getSharedConfig;
