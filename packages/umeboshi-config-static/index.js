const path = require('path');
const requireUncached = require('require-uncached');
const clientConfig = require('./lib/webpack.client');
const serverConfig = require('./lib/webpack.server');

const {
    staticMiddleware
} = require('umeboshi-config-spa/middlewares');

const renderMiddleware = () => {
    const { render } = requireUncached(`${serverCfg.output.path}js/ssr.js`);

    return (ctx, next) => {

        if (ctx.method === 'GET' && /(\/|\.html)$/.test(ctx.path)) {

            let page = '';
            if (ctx.path.endsWith('/')) {
                page += `${ctx.path}/index.js`;
            } else if (ctx.path.endsWith('.html')) {
                page += ctx.path.replace(/\.html$/, '.js');
            }

            page = page.replace(/\/+/g, '/').replace(/^\//, '');

            const {
                html
            } = render({
                page
            });

            ctx.body = html;
        }

        return next();
    };

};

module.exports = ({ config }) => {

    let baseConfig;
    try {
        if (path.isAbsolute(config)) {
            baseConfig = require(config);
        } else {
            baseConfig = require(`umeboshi-config-${config}`);
        }
    } catch (e) {
        throw new Error(`Unable to resolve passed-in config: "${config}"`);
    }

    const { webpack } = baseConfig;

    return {
        webpack(env) {

            return [
                clientConfig(webpack(env)),
                serverConfig(webpack(env))
            ];
        },
        middlewares: [
            staticMiddleware()
        ],
        onServe(serverOpts, env, configs, clientCompiler) {

            if (!Array.isArray(configs)) {
                throw new TypeError('You must provide two configuration: client and server');
            }

            const [, serverCfg] = configs;
            const serverCompiler = webpack(serverCfg);

            //augment this config with a livereload server maybe?
            const oldAdd = serverOpts.add;

            serverOpts.add = (app) => {

                clientCompiler.plugin('done', () => {

                    let renderM;

                    serverCompiler.watch(
                        {},
                        () => {
                            const oldInstance = app.middleware.indexOf(renderM);
                            if (oldInstance !== -1) {
                                app.middleware.splice(oldInstance, 1);
                            }
                            renderM = renderMiddleware();
                            app.use(renderM);
                        }// eslint-disable-line no-unused-vars
                    );
                });

                oldAdd(app);
            };



        }
    };
};