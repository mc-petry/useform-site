const path = require('path')

module.exports = {
  reactStrictMode: true,
  webpack(config, options) {
    // Allow to use npm-link
    config.resolve.alias.react = path.resolve('./node_modules/react')

    return config
  }
}
