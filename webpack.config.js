module.exports = {
  target: 'web',
  entry: {
    index: './src/fetch-api-wrapper.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'fetch-api-wrapper.js',
    library: 'fetch-api-wrapper',
    libraryTarget: 'umd',
  }
}