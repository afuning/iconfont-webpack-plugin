const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const IconfontPlugin = require('../index.js');

const resolve = (p) => path.resolve(__dirname, p)

module.exports = {
  context: __dirname,
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, ''),
    hot: true
  },
  entry: {
    index: './index.js',
  },
  output: {
    path: resolve('dist'),
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index-svg.html',
      filename: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new IconfontPlugin({
      type: 'svg',
      key: 'font_1238539_32r8c9ul8x2',
      baseOption: {
        fontFamily: 'afuning'
      },
      dist: {
        dirPath: "icon",
        filename: "afuning"
      }
    })
  ]
}