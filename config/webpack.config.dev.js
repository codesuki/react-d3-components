const merge = require('webpack-merge');

module.exports = merge(require('./webpack.config.base'), {
    mode: 'development',
    devtool: 'eval',
    output: {
        filename: 'react-d3-components.js'
    }
});
