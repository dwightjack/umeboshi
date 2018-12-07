const webpack = require('webpack');
const portfinder = require('portfinder');
const Server = require('webpack-dev-server');
const identity = require('lodash/identity');
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
    clientConfig = webpackConfig.filter(({ target }) => target === 'web');
} else {
    clientConfig = webpackConfig;
}

if (!clientConfig) {
    throw new TypeError('Invalid webpack configuration');
}

const env = {
    analyze: false,
    production: false,
    server: true
};
const { config, api } = resolveConfig(createConfig(env)).evaluate();
const { middlewares, devServer } = config;
const { port } = api.hosts.local;

api.hooks.devServerStart.tap('devServerStart', identity);

(async () => {
    //get the port and start the server
    const p = await portfinder.getPortPromise({ port });
    const {
        devServer: umeDevServer,
        middlewares: umeMiddlewares
    } = loadUmeboshiConfig();

    const appMiddlewares = umeMiddlewares
        ? evaluate(umeMiddlewares, evaluate(middlewares, env), env)
        : evaluate(middlewares, env);
    const args = [
        { port: p, publicPath: webpackConfig.output.publicPath },
        webpackConfig
    ];
    const options = Object.assign(
        {
            before(app) {
                if (appMiddlewares && appMiddlewares.length > 0) {
                    appMiddlewares.forEach((middleware) => app.use(middleware));
                }
            }
        },
        mergeConfig(devServer(...args), umeDevServer, ...args)
    );

    await api.hooks.devServer.promise(options, { port: p }, api);

    Server.addDevServerEntrypoints(clientConfig, options);

    const compiler = webpack(clientConfig);

    const server = new Server(compiler, options);

    server.app.compiler = compiler;

    server.listen(options.port, options.host, () => {
        api.hooks.devServerStart.call(server, options);
        logger.message('`\nStarted a server at:\n');
        logger.message(`- http://localhost:${p}`);
        logger.message(`- http://${api.address}:${p}\n`);
    });
})();
