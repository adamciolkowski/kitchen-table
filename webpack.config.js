var path = require('path');

module.exports = {
    entry: './src/KitchenTable.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'KitchenTable.js',
        libraryTarget: 'commonjs2'
    },
    externals: {
        "react": 'react'
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
