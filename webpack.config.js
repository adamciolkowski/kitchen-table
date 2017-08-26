var path = require('path');

module.exports = {
    entry: './src/index',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'KitchenTable.js',
        library: 'KitchenTable',
        libraryTarget: 'umd'
    },
    externals: {
        "react": {
            amd: 'react',
            commonjs: 'react',
            commonjs2: 'react',
            root: 'React'
        }
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: 'ts-loader'
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    }
};
