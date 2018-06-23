const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin')

const getSharedConfig = () => ({
  entry: {
    popup: './src/js/popup.js',
    content: './src/js/content.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      path.resolve('./src/js/'),
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
  ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
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