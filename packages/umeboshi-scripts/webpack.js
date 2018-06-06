const {
    loadUmeboshiConfig, mergeConfig, toWebpackConfig, evaluate, resolveConfig
} = require('umeboshi-dev-utils');
const createConfig = require('umeboshi-dev-utils/lib/config');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const identity = require('lodash/identity');

const PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = (e = {}) => {

    const env = Object.assign({ production: PRODUCTION }, e);
    const { config } = resolveConfig(createConfig(env)).evaluate();
    const webpackConfig = config.webpack;
    const umeWebpack = loadUmeboshiConfig('webpack');

    const addAnalyzer = env.analyze ? (cfg) => {
        cfg.plugin('bundle-analyzer')
            .use(BundleAnalyzerPlugin, [{
                analyzerHost: '0.0.0.0'
            }]);
        return cfg;
    } : identity;
    const packageConfig = evaluate(webpackConfig, env);

    if (Array.isArray(packageConfig)) {
        return packageConfig.reduce(
            (a, c) => a.concat(toWebpackConfig(mergeConfig(addAnalyzer(c), umeWebpack, env, true))),
            []
        );
    }
    return toWebpackConfig(mergeConfig(addAnalyzer(packageConfig), umeWebpack, env));
};