const webpack = require('webpack');
const portfinder = require('portfinder');
const serve = require('webpack-dev-server');
const {
    loadUmeboshiConfig,
    mergeConfig,
    evaluate,
    resolveConfig
} = require('umeboshi-dev-utils');
const logger = require('umeboshi-dev-utils/lib/logger');
const createConfig = require('umeboshi-dev-utils/lib/config');

const webpackConfig = require('./webpack')({
    analyze: false,
    production: false,
    server: true
});
let clientConfig;

if (Array.isArray(webpackConfig)) {
    clientConfig = webpackConfig.find(({ target }) => target === 'web');
} else {
    clientConfig = webpackConfig;
}

if (!clientConfig) {
    throw new TypeError('Invalid webpack configuration');
}

const compiler = webpack(clientConfig);

const env = {
    analyze: false,
    production: false,
    server: true,
    compiler
};
const { config, api } = resolveConfig(createConfig(env)).evaluate();
const { middlewares, devServer } = config;
const { port } = api.hosts.local;

//get the port and start the server
portfinder.getPortPromise({ port }).then((p) => {
    const {
        devServer: umeDevServer,
        middlewares: umeMiddlewares
    } = loadUmeboshiConfig();

    const appMiddlewares = umeMiddlewares
        ? evaluate(umeMiddlewares, evaluate(middlewares, env), env)
        : evaluate(middlewares, env);
    const args = [
        { port: p, publicPath: webpackConfig.output.publicPath },
        webpackConfig,
        compiler
    ];
    const options = Object.assign(
        {
            setup(app) {
                if (appMiddlewares && appMiddlewares.length > 0) {
                    appMiddlewares.forEach((middleware) => app.use(middleware));
                }
            }
        },
        mergeConfig(devServer(...args), umeDevServer, ...args)
    );

    api.hooks.devServer.promise(options, { port: p }, api).then(() => {
        const server = serve(compiler, options);
        server.on('listening', () => {
            logger.message('`\nStarted a server at:\n');
            logger.message(`- http://localhost:${p}`);
            logger.message(`- http://${api.address}:${p}\n`);
        });
    });
});
