const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const {
    optimize: { OccurrenceOrderPlugin, AggressiveMergingPlugin }
} = require('webpack');

module.exports = merge(require('./webpack.config.base'), {
    mode: 'production',
    devtool: 'source-map',
    output: {
        filename: 'react-d3-components.min.js',
        sourceMapFilename: 'react-d3-components.js.map'
    },
    plugins: [
        new OccurrenceOrderPlugin(),
        new AggressiveMergingPlugin(),
        new UglifyJsPlugin({
            sourceMap: true,
            uglifyOptions: {
                compress: {
                    warnings: false
                }
            }
        })
    ]
});
