const webpack = require('webpack');
const once = require('lodash/once');
const { staticMiddleware } = require('umeboshi-config-spa/middlewares');
const SseChannel = require('sse-channel');
const logger = require('umeboshi-dev-utils/lib/logger');
const ssrMiddleware = require('./lib/ssr.middleware');
const sseReloadMiddleware = require('./lib/sse-reload.middleware');

module.exports = (config, { ssr }) => {
    config.tap('env', (env) => {
        return Object.assign(env, {
            jamstackSSR: ssr
        });
    });

    config.hooks.bundlerConfig.tap('jamStackBundle', (clientConfig, env) => {
        const serverConfig = require('umeboshi-scripts/webpack')(
            Object.assign({}, env, { target: 'node' })
        );
        return [].concat(clientConfig, serverConfig);
    });

    config.hooks.devServer.tap('jamStackDevServer', (options, env, api) => {
        const serverConfig = require('umeboshi-scripts/webpack')({
            analyze: false,
            production: false,
            server: true,
            target: 'node'
        });
        const { before } = options;
        const compiler = webpack(serverConfig);

        const sse = new SseChannel({
            cors: { origins: ['*'] },
            jsonEncode: true
        });

        options.before = (app) => {
            //eslint-disable-line no-param-reassign
            before(app);
            app.use(
                ssrMiddleware({
                    templatePath: api.paths.toAbsPath('tmp/templates'),
                    compiler
                })
            );
            app.sse = sse;
            app.use(sseReloadMiddleware(sse));
        };
    });

    config.hooks.devServerStart.tap('jamStackDevServerStart', (server) => {
        const { compiler: clientCompiler, sse } = server.app;
        clientCompiler.hooks.done.tap(
            'jamServerStart',
            once(() => {
                logger.log('Starting rendering server in watch mode...');
                let isFirst = true;

                const watcher = clientCompiler.watch({}, (err, stats) => {
                    if (isFirst) {
                        logger.message('Rendering server started!');
                        isFirst = false;
                        return;
                    }
                    if (err) {
                        logger.error(err);
                        sse.send({ message: err.toString(), event: 'error' });
                        return;
                    }

                    if (stats.hasErrors()) {
                        const { errors } = stats.toJson();
                        logger.error(errors);
                        sse.send({
                            message: 'Compilation error',
                            event: 'error'
                        });
                        return;
                    }

                    logger.log('Server bundle rendered. Reloading...');
                    if (logger.hasLevel(0)) {
                        const data = stats.toJson('minimal');
                        logger.verbose(data);
                    }
                    sse.send({ event: 'reload' });
                });

                clientCompiler.hooks.watchClose.tap('onClose', () => {
                    watcher.close(() => {
                        logger.verbose('Rendering server stopped.');
                    });
                });
            })
        );
    });

    config.tap('webpack', (...args) => {
        const [webpackConfig, , env = {}] = args;

        const IS_SERVER = env.target === 'node';

        if (IS_SERVER) {
            require('./lib/webpack.server')(...args);
        } else {
            require('./lib/webpack.client')(...args);
        }

        if (webpackConfig.plugins.has('define')) {
            webpackConfig.plugin('define').tap(([options]) => {
                return [
                    Object.assign(options, {
                        __SERVER__: IS_SERVER
                    })
                ];
            });
        } else {
            webpackConfig.plugin('define').use(webpack.DefinePlugin, [
                {
                    __PRODUCTION__: !!env.production,
                    __SERVER__: webpackConfig.get('target') === 'node'
                }
            ]);
        }
    });

    config.set('middlewares', ({ paths }) => {
        return [
            staticMiddleware(paths.toAbsPath('dist.root')),
            require('./lib/sse.middleware')()
        ];
    });
};
