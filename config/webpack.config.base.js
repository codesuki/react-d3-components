const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, '../src/index.jsx'),
    output: {
        library: 'ReactD3',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [
            {
                test: /.jsx$/,
                loader: 'babel-loader',
                include: path.resolve(__dirname, '../src')
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    externals: {
        d3: true,
        react: 'React',
        'react-dom': 'ReactDOM'
    }
};
