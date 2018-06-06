const {
    staticMiddleware
} = require('umeboshi-config-spa/middlewares');
const webpack = require('webpack');

const proxy = require('koa-proxy');
const once = require('lodash/once');
const execa = require('execa');

const noop = () => {};

module.exports = (config, { port = 9000 }) => {

    config.set('jamstack', { port });

    const oldServe = config.get('onServe') || noop;

    config.set('onServe', ({ paths }) => {

        return (...args) => {
            oldServe(...args);
            const [{ compiler }] = args;

            compiler.hooks.done.tap('jamServerStart', once(() => {
                execa('ume-jam-server', {
                    env: {
                        MANIFEST: paths.toAbsPath('dist.assets/manifest.json'),
                        TARGET_ENV: 'node'
                    },
                    cwd: process.cwd(),
                    stdio: ['inherit', 'inherit', 'inherit']
                });
            }));

            return true;
        };


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