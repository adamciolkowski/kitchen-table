var path = require('path');

module.exports = {
    entry: './src/KitchenTable.jsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'KitchenTable.js',
        libraryTarget: 'commonjs2'
    },
    externals: {
        "react": 'react'
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    }
};
