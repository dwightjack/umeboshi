const { loadConfig, loadUmeboshiConfig, mergeConfig } = require('umeboshi-dev-utils');
const isFunction = require('lodash/isFunction');
const PRODUCTION = process.env.NODE_ENV === 'production';

const umeWebpack = loadUmeboshiConfig('webpack');

const toConfig = (config) => {
    if (Array.isArray(config)) {
        return config.map(toConfig);
    }
    return isFunction(config.toConfig) ? config.toConfig() : config;
};

module.exports = (env) => {

    const webpackConfig = env && env.analyze ? loadConfig('webpack/webpack.analyze.js') : loadConfig(`webpack/webpack.${PRODUCTION ? 'prod' : 'dev'}.js`);

    const packageConfig = webpackConfig(env);

    if (Array.isArray(packageConfig)) {
        return packageConfig.reduce(
            (a, c) => a.concat(toConfig(mergeConfig(c, umeWebpack, env, true))),
            []
        );
    }
    return toConfig(mergeConfig(packageConfig, umeWebpack, env));
};