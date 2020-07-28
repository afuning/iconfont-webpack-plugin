const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const IconfontPlugin = require('../index.js');

const resolve = (p) => path.resolve(__dirname, p)

module.exports = {
  context: __dirname,
  entry: {
    index: './index.js',
  },
  output: {
    path: resolve('dist'),
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html',
    }),
    new IconfontPlugin({
      key: "font_1238539_zmfljpqtw7"
    })
  ]
}