const address = require('ip').address();
const {
    loadConfig, loadUmeboshiConfig, mergeConfig, evaluate
} = require('../index');

const defaultMiddlewares = loadConfig('middlewares.js');
const hosts = loadConfig('hosts.js');

const umeMiddlewares = loadUmeboshiConfig('middlewares');
const umeHosts = loadUmeboshiConfig('hosts');

const middlewares = umeMiddlewares ? evaluate(umeMiddlewares, defaultMiddlewares) : defaultMiddlewares;
const localhost = mergeConfig(hosts, umeHosts).local;

module.exports = {
    address,
    localhost,
    middlewares
};