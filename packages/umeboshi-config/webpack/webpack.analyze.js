const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const merge = require('webpack-merge');
const webpackConf = require('./webpack.prod');


module.exports = merge(webpackConf, {
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerHost: '0.0.0.0'
        })
    ]
});