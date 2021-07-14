module.exports = {
  publicPath: process.env.NODE_ENV === 'production' && process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH : '/',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true
      }
    }
  }
}
