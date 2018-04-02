const { loadConfig, loadUmeboshiConfig, mergeConfig } = require('umeboshi-dev-utils');

const PRODUCTION = process.env.NODE_ENV === 'production';

const $loaders = loadConfig('webpack/loaders.js');
const $plugins = loadConfig('webpack/plugins.js');
const umeWebpack = loadUmeboshiConfig('webpack');

module.exports = (env) => {

    const webpackConfig = env && env.analyze ? loadConfig('webpack/webpack.analyze.js') : loadConfig(`webpack/webpack.${PRODUCTION ? 'prod' : 'dev'}.js`);

    const config = mergeConfig(webpackConfig, umeWebpack, env, $loaders, $plugins);

    config.module.rules.push(...$loaders.toLoaders());
    config.plugins.push(...$plugins.toPlugins());

    return config;
};