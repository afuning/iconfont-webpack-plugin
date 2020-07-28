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
      template: 'index-fontclass.html',
      filename: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new IconfontPlugin({
      type: 'fontclass',
      key: 'font_1238539_zmfljpqtw7',
      baseOption: {
        fontFamily: 'afuning',
        fontSize: '22px'
      },
      dist: {
        dirPath: "icon",
        filename: "afuning"
      }
    })
  ]
}