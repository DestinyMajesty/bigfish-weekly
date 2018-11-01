const withLess = require('@zeit/next-less')
const SentryPlugin = require('@sentry/webpack-plugin')

module.exports = withLess(
  {
    lessLoaderOptions: {
      javascriptEnabled: true,
    },
    webpack(config, { dev }) {
      // Further custom configuration here
      if (!dev) {
        config.devtool = 'source-map'
        config.plugins.push(new SentryPlugin({
          include: './.next',
          release: process.env.RELEASE,
          ignore: ['node_modules'],
        }))
      }

      return config
    },
    serverRuntimeConfig: { // Will only be available on the server side
      transpond: {
        java: {
          // YAPI
          url: 'http://172.19.1.93:3000/mock/224/api',
          // 开发
          // url: 'http://172.19.1.86/weekly/api',
        },
      },
    },
    publicRuntimeConfig: { // Will be available on both server and client
      transpond: {
        java: {
          // YAPI
          url: 'http://172.19.1.93:3000/mock/224/api',
          // url: 'http://172.19.1.86/weekly/api',
        },
      },
    },
  },

)
