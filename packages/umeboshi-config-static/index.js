const {
    staticMiddleware
} = require('umeboshi-config-spa/middlewares');

module.exports = (config) => {

    config.tap('webpack', (...args) => {
        if (process.env.WEBPACK_TARGET === 'node') {
            require('./lib/webpack.server')(...args);
        } else {
            require('./lib/webpack.client')(...args);
        }
    });

    config.set('middlewares', ({ paths }) => {
        return [
            staticMiddleware(staticMiddleware(paths.toAbsPath('dist.root')))
        ];
    });

};