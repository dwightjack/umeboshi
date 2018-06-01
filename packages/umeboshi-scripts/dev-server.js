const webpack = require('webpack');
const portfinder = require('portfinder');
const { green } = require('chalk');
const noop = require('lodash/noop');
const isFunction = require('lodash/isFunction');
const serve = require('webpack-serve');
const {
    loadUmeboshiConfig, mergeConfig, evaluate, resolveConfig
} = require('umeboshi-dev-utils');
const { localhost, address } = require('umeboshi-dev-utils/lib/server');
const { port } = localhost;

const config = require('./webpack')({ analyze: false, production: false, server: true });
let clientConfig;

if (Array.isArray(config)) {
    clientConfig = config.find(({ target }) => target === 'web');
} else {
    clientConfig = config;
}

if (!clientConfig) {
    throw new TypeError('Invalid webpack configuration');
}

//get the port and start the server
portfinder.getPortPromise({ port }).then((p) => {
    const compiler = webpack(clientConfig);
    const env = { server: true, compiler };
    const { middlewares, devServer, onServe = noop } = resolveConfig(env);

    const { devServer: umeDevServer, middlewares: umeMiddlewares, onServe: umeOnServe } = loadUmeboshiConfig();

    const appMiddlewares = umeMiddlewares ? evaluate(umeMiddlewares, evaluate(middlewares, env), env) : middlewares;
    const args = [{ port: p, publicPath: config.output.publicPath }, config, compiler];
    const options = Object.assign(
        {
            add(app) {
                if (appMiddlewares.length > 0) {
                    appMiddlewares.forEach(
                        (middleware) => app.use(middleware)
                    );
                }

            }
        },
        mergeConfig(devServer(...args), umeDevServer, ...args),
        { compiler }
    );

    Promise.all([onServe(options, ...args), isFunction(umeOnServe) && umeOnServe(options, ...args)])
        .then(() => serve(options))
        .then((server) => {
            server.on('listening', () => {
                console.log(green('`\nStarted a server at:\n')); //eslint-disable-line no-console
                console.log(green(`- http://localhost:${p}`)); //eslint-disable-line no-console
                console.log(green(`- http://${address}:${p}\n`)); //eslint-disable-line no-console
            });
        });

});