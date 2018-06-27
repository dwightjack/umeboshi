const requireUncached = require('require-uncached');
const logger = require('umeboshi-dev-utils/lib/logger');
const { getTemplate } = require('./utils');

const ssrMiddleware = ({
    templatePath,
    compiler,
    match = /(\/|\.html?)$/
}) => {

    let render;

    compiler.hooks.afterEmit.tap('reloadBundle', ({ assets }) => {
        const bundle = Object.keys(assets).filter((k) => !!assets[k].emitted).find((k) => k.endsWith('.js'));

        if (bundle) {
            render = requireUncached(assets[bundle].existsAt).render; //eslint-disable-line prefer-destructuring
        } else {
            logger.warning(`Unable to find ssr bundle. Emitted assets: ${Object.keys(assets).join(', ')} `);
        }
    });

    const matcher = typeof match === 'function' ? match : (ctx) => ctx.method === 'GET' && match.test(ctx.path);

    return (ctx, next) => {

        if (matcher(ctx)) {

            return render(ctx).then(({
                html,
                head = {},
                template
            }) => {
                const pageTmpl = getTemplate(template, templatePath);

                const output = pageTmpl({
                    html,
                    head
                });

                ctx.body = output;
                return next();
            }).catch((e) => {
                logger.error(e);
                return next();
            });
        }

        return next();
    };
};

module.exports = ssrMiddleware;