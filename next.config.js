const withCSS = require('@zeit/next-css')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const cfg = {
  assetPrefix: process.env.NODE_ENV === 'production' ? '/useform-site' : '',
  optimizeImages: false,
  webpack(config, options) {
    // config.plugins = config.plugins.filter(plugin => {
    //   return plugin.constructor.name !== "ForkTsCheckerWebpackPlugin";
    // });
    // only report errors on a matcher that doesn't match anything
    // config.plugins.push(
    //   new ForkTsCheckerWebpackPlugin({
    //     reportFiles: ["does-not-exist"],
    //   }),
    // );


    // Allow to use npm-link
    config.resolve.alias.react = require.resolve('react')

    return config
  }
}

module.exports = withCSS(cfg)
