// webpack.config.js

var webpack = require("webpack");

module.exports = {
    entry: 'view',
    output: {
        path: __dirname,
        filename: 'index.js'
    },
    resolve: {
        root: [__dirname + '/src', __dirname],
        extensions: ['', '.jsx', '.js', '.json'],
        packageAlias: "browser"
    },
    amd: { jQuery: true },
    module: {
        preLoaders: [
            {test: /\.(js|jsx)$/, loader: "eslint-loader", include: __dirname + '/src' }
        ],
        loaders: [
            {test: /\.jsx$/, loader: "jsx-loader"}
        ]
    }
};
