const portfinder = require('portfinder');
const {
    loadUmeboshiConfig, evaluate, resolveConfig
} = require('umeboshi-dev-utils');
const logger = require('umeboshi-dev-utils/lib/logger');
const createConfig = require('umeboshi-dev-utils/lib/config');

const env = { server: false };
const { config, api } = resolveConfig(createConfig(env)).evaluate();
const { middlewares, createServer } = config;

const umeMiddlewares = loadUmeboshiConfig('middlewares');
const umeServer = loadUmeboshiConfig('createServer');

const appMiddlewares = umeMiddlewares ? evaluate(umeMiddlewares, evaluate(middlewares, env), env) : evaluate(middlewares, env);

const { port } = api.hosts.local;

portfinder.getPortPromise({ port }).then((p) => {

    const app = (umeServer || createServer)({
        middlewares: appMiddlewares,
        port: p
    });

    app.listen(p, () => {
        logger.message('Static server listening at:\n');
        logger.message(`- http://localhost:${p}`);
        logger.message(`- http://${api.address}:${p}`);
    });
});