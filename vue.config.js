module.exports = {

  devServer: {
    // Proxy all unexpected requests to apollo server
    // need for graphql mocking
    proxy: 'http://localhost:4000'
  },

  pluginOptions: {

    apollo: {
      enableMocks: true,
      enableEngine: false
    }
  }
}
