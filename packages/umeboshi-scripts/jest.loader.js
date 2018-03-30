const { loadConfig, loadUmeboshiConfig, mergeConfig } = require('umeboshi-dev-utils');

const jest = loadConfig('jest.config.js');
const umeJest = loadUmeboshiConfig('jest');

module.exports = mergeConfig(jest, umeJest);