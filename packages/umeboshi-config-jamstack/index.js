const path = require('path');
const webpack = require('webpack');
const execa = require('execa');
const proxy = require('koa-proxy');
const once = require('lodash/once');
const {
    staticMiddleware
} = require('umeboshi-config-spa/middlewares');


module.exports = (config, { port = 9000, index }) => {

    config.set('jamstack', { port, index });

    config.hooks.bundlerConfig.tap('jamStackBundle', (clientConfig, env) => {
        const serverConfig = require('umeboshi-scripts/webpack')(Object.assign({}, env, { target: 'node' }));
        return [clientConfig, serverConfig];
    });

    config.hooks.devServer.tap('jamStackDevServer', ({ compiler }) => {

        compiler.hooks.done.tap('jamServerStart', once(() => {
            execa('node', [path.resolve(__dirname, './scripts/jam-server.js')], {
                env: {
                    TARGET_ENV: 'node'
                },
                cwd: process.cwd(),
                stdio: ['inherit', 'inherit', 'inherit']
            });
        }));
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
            webpackConfig.plugin('define')
                .tap(([options]) => {
                    return [
                        Object.assign(options, {
                            __SERVER__: IS_SERVER
                        })
                    ];
                });
        } else {
            webpackConfig
                .plugin('define')
                .use(webpack.DefinePlugin, [{
                    __PRODUCTION__: !!env.production,
                    __SERVER__: webpackConfig.get('target') === 'node'
                }]);
        }
    });

    config.set('middlewares', ({ paths, address }) => {
        return [
            proxy({
                host: `http://${address}:${port}`,
                match: /(\.html?|\/)$/
            }),
            staticMiddleware(paths.toAbsPath('dist.root'))
        ];
    });

};