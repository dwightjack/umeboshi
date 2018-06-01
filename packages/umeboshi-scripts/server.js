const { green } = require('chalk');
const portfinder = require('portfinder');
const { localhost, address } = require('umeboshi-dev-utils/lib/server');
const {
    loadUmeboshiConfig, evaluate, resolveConfig
} = require('umeboshi-dev-utils');

const env = { server: false };
const { middlewares, createServer } = resolveConfig(env);

const umeMiddlewares = loadUmeboshiConfig('middlewares');
const umeServer = loadUmeboshiConfig('createServer');

const appMiddlewares = umeMiddlewares ? evaluate(umeMiddlewares, evaluate(middlewares, env), env) : middlewares;

const { port } = localhost;


portfinder.getPortPromise({ port }).then((p) => {

    const app = (umeServer || createServer)({
        middlewares: appMiddlewares,
        port: p
    });

    app.listen(p, () => {
        console.log(green('Static server listening at:\n')); //eslint-disable-line no-console
        console.log(green(`- http://localhost:${p}`)); //eslint-disable-line no-console
        console.log(green(`- http://${address}:${p}`)); //eslint-disable-line no-console
    });
});