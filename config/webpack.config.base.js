const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, '../src/index.js'),
    output: {
        library: 'ReactD3',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [
            {
                test: /.js$/,
                loader: 'babel-loader',
                include: path.resolve(__dirname, '../src')
            }
        ]
    },
    externals: {
        d3: true,
        react: 'React',
        'react-dom': 'ReactDOM'
    }
};
