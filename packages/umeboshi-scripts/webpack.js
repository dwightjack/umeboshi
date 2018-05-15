const { loadConfig, loadUmeboshiConfig, mergeConfig } = require('umeboshi-dev-utils');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const isFunction = require('lodash/isFunction');
const identity = require('lodash/identity');
const PRODUCTION = process.env.NODE_ENV === 'production';

const umeWebpack = loadUmeboshiConfig('webpack');

const toConfig = (config) => {
    if (Array.isArray(config)) {
        return config.map(toConfig);
    }
    return isFunction(config.toConfig) ? config.toConfig() : config;
};

module.exports = (env = {}) => {

    const { analyze } = env;
    const webpackConfig = loadConfig(`webpack/webpack.${PRODUCTION || analyze ? 'prod' : 'dev'}.js`);

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
            (a, c) => a.concat(toConfig(mergeConfig(addAnalyzer(c), umeWebpack, env, true))),
            []
        );
    }
    return toConfig(mergeConfig(addAnalyzer(packageConfig), umeWebpack, env));
};