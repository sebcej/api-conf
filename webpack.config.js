const path = require('path')

module.exports = {
  mode: 'production',
  target: 'web',
  entry: {
    index: './src/fetch-api-wrapper.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js',
    library: 'fetch-api-wrapper',
    libraryTarget: 'umd',
  }
}