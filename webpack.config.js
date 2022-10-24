const path = require('path')

module.exports = {
  mode: 'production',
  target: 'web',
  entry: {
    index: './src/main.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js',
    library: 'api-conf',
    libraryTarget: 'umd',
  }
}