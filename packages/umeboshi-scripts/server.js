const { green } = require('chalk');
const portfinder = require('portfinder');
const {
    loadUmeboshiConfig, evaluate, resolveConfig
} = require('umeboshi-dev-utils');
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
        console.log(green('Static server listening at:\n')); //eslint-disable-line no-console
        console.log(green(`- http://localhost:${p}`)); //eslint-disable-line no-console
        console.log(green(`- http://${api.address}:${p}`)); //eslint-disable-line no-console
    });
});