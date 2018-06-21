const {
    staticMiddleware
} = require('umeboshi-config-spa/middlewares');
const webpack = require('webpack');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const WebpackJamPlugin = require('./lib/webpack-jam');

const proxy = require('koa-proxy');
const once = require('lodash/once');
const execa = require('execa');

module.exports = (config, { port = 9000 }) => {

    config.set('jamstack', { port });

    config.hooks.bundlerConfig.tap('jamStackBundle', (clientConfig, env) => {
        const serverConfig = require('umeboshi-scripts/webpack')(Object.assign({}, env, { target: 'node' }));
        const jamPugin = new WebpackJamPlugin();

        clientConfig.plugins.push(jamPugin.client);
        serverConfig.plugins.push(jamPugin.server);

        jamPugin.onComplete(([MANIFEST, SSR]) => {
            execa('ume-jam-render', {
                env: {
                    MANIFEST,
                    SSR,
                    TARGET_ENV: 'node'
                },
                cwd: process.cwd(),
                stdio: ['inherit', 'inherit', 'inherit']
            });
        });

        return [clientConfig, serverConfig];
    });

    config.hooks.devServer.tap('jamStackDevServer', ({ compiler }) => {

        compiler.hooks.done.tap('jamServerStart', once(({ compilation }) => {
            execa('ume-jam-server', {
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