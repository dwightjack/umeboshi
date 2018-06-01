const { resolveConfig, loadUmeboshiConfig, mergeConfig } = require('umeboshi-dev-utils');

const { jest } = resolveConfig();
const umeJest = loadUmeboshiConfig('jest');

module.exports = mergeConfig(jest, umeJest);