const prodConfig = require('./config/webpack.config.prod');
const devConfig = require('./config/webpack.config.dev');

module.exports = [prodConfig, devConfig];
