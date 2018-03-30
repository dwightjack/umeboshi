const { argv } = require('yargs');
const { loadConfig, loadUmeboshiConfig, mergeConfig } = require('umeboshi-dev-utils');

const analyze = !!argv.analyze;
const PRODUCTION = process.env.NODE_ENV === 'production';

const $loaders = loadConfig('webpack/loaders.js');
const $plugins = loadConfig('webpack/plugins.js');
const webpackConfig = analyze ? loadConfig('webpack/analyze.js') : loadConfig(`webpack/webpack.${PRODUCTION ? 'prod' : 'dev'}.js`);
const umeWebpack = loadUmeboshiConfig('webpack');

const config = mergeConfig(webpackConfig, umeWebpack, $loaders, $plugins);

config.module.rules.push(...$loaders.toLoaders());
config.plugins.push(...$plugins.toPlugins());

module.exports = config;