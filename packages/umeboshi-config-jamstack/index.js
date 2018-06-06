const {
    staticMiddleware
} = require('umeboshi-config-spa/middlewares');

const proxy = require('koa-proxy');

module.exports = (config) => {

    config.tap('webpack', (...args) => {
        if (process.env.WEBPACK_TARGET === 'node') {
            require('./lib/webpack.server')(...args);
        } else {
            require('./lib/webpack.client')(...args);
        }
    });

    config.set('middlewares', ({ paths, address }) => {
        return [
            proxy({
                host: `http://${address}:8080`,
                match: /(\.html?|\/)$/
            }),
            staticMiddleware(paths.toAbsPath('dist.root'))
        ];
    });

};