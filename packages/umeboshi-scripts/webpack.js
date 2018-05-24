const {
    loadConfig, loadUmeboshiConfig, mergeConfig, toWebpackConfig
} = require('umeboshi-dev-utils');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const identity = require('lodash/identity');
const PRODUCTION = process.env.NODE_ENV === 'production';

const umeWebpack = loadUmeboshiConfig('webpack');

module.exports = (env = {}) => {

    const { analyze, production = PRODUCTION } = env;
    const webpackConfig = loadConfig(`webpack/webpack.${production || analyze ? 'prod' : 'dev'}.js`);

    const addAnalyzer = analyze ? (config) => {
        config.plugin('bundle-analyzer')
            .use(BundleAnalyzerPlugin, [{
                analyzerHost: '0.0.0.0'
            }]);
        return config;
    } : identity;
    const packageConfig = webpackConfig(env);

    if (Array.isArray(packageConfig)) {
        return packageConfig.reduce(
            (a, c) => a.concat(toWebpackConfig(mergeConfig(addAnalyzer(c), umeWebpack, env, true))),
            []
        );
    }
    return toWebpackConfig(mergeConfig(addAnalyzer(packageConfig), umeWebpack, env));
};