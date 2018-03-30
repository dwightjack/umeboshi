const { argv } = require('yargs');
const { loadConfig, loadUmeboshiConfig, mergeConfig } = require('umeboshi-dev-utils');

const analyze = !!argv.analyze
const PRODUCTION = process.env.NODE_ENV === 'production';

const webpackConfig = analyze ? loadConfig('webpack/analyze.js') : loadConfig(`webpack/webpack.${PRODUCTION ? 'prod' : 'dev'}.js`);
const umeWebpack = loadUmeboshiConfig('webpack');

module.exports = mergeConfig(webpackConfig, umeWebpack);