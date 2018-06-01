const { resolveConfig, loadUmeboshiConfig, mergeConfig } = require('umeboshi-dev-utils');
const createConfig = require('umeboshi-dev-utils/lib/config');

const { config } = resolveConfig(createConfig()).evaluate();
const umeJest = loadUmeboshiConfig('jest');

module.exports = mergeConfig(config.jest || {}, umeJest);