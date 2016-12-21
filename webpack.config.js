var path = require('path');
var webpack = require('webpack');

module.exports = {
    resolve: {
        extensions: ['', '.js']
    },
    entry: './src/js/app.js',
    output: {
        path: path.resolve(__dirname, 'assets/js'),
        filename: 'app.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};