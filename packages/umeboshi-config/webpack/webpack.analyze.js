const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { loadConfig } = require('umeboshi-dev-utils');
const merge = require('webpack-merge');
const webpackConf = loadConfig('webpack/webpack.prod.js');


module.exports = merge(webpackConf, {
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerHost: '0.0.0.0'
        })
    ]
});