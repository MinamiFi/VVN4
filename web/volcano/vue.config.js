const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: false,
  lintOnSave: false,
  devServer: {
    open: { app: { name: 'chrome' } },
    host: '0.0.0.0',
    // host: '127.0.0.1',
    port: '8080',
  },
  publicPath: './'
})
