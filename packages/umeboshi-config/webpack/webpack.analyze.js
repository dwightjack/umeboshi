const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env) => {
    const config = require('./webpack.prod')(env);

    config.plugin('bundle-analyzer')
        .use(BundleAnalyzerPlugin, [{
            analyzerHost: '0.0.0.0'
        }]);

    return config;

};