const { loadConfig, loadUmeboshiConfig, mergeConfig } = require('umeboshi-dev-utils');

const PRODUCTION = process.env.NODE_ENV === 'production';

const umeWebpack = loadUmeboshiConfig('webpack');

module.exports = (env) => {

    const webpackConfig = env && env.analyze ? loadConfig('webpack/webpack.analyze.js') : loadConfig(`webpack/webpack.${PRODUCTION ? 'prod' : 'dev'}.js`);

    const packageConfig = webpackConfig(env);

    if (Array.isArray(packageConfig)) {
        return packageConfig.map((c) => mergeConfig(c, umeWebpack, env).toConfig());
    }

    return mergeConfig(packageConfig, umeWebpack, env).toConfig();
};