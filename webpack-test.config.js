const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    index: './src/main.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js',
    library: 'api_conf',
  }
}