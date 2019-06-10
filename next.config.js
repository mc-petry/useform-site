const withCSS = require('@zeit/next-css')
const withTypescript = require('@zeit/next-typescript')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const cfg = {
  assetPrefix: process.env.NODE_ENV === 'production' ? '/useform-site' : '',
  optimizeImages: false,
  webpack(config, options) {
    // Do not run type checking twice:
    if (options.isServer) {
      config.plugins.push(new ForkTsCheckerWebpackPlugin())
    }

    // Allow to use npm-link
    config.resolve.alias.react = require.resolve('react')

    return config
  }
}

module.exports = withCSS(withTypescript(cfg))
