const requireUncached = require('require-uncached');
const { getTemplate } = require('./utils');

const ssrMiddleware = ({
    templatePath,
    compiler,
    match = /(\/|\.html?)$/
}) => {

    const manifest = process.env.MANIFEST ? requireUncached(process.env.MANIFEST) : {};

    let render;

    compiler.hooks.afterEmit.tap('reloadBundle', ({ assets }) => {
        const bundle = Object.keys(assets).filter((k) => !!assets[k].emitted).find((k) => k.endsWith('.js'));

        if (bundle) {
            render = requireUncached(assets[bundle].existsAt).render; //eslint-disable-line prefer-destructuring
        } else {
            console.warn(`Unable to find ssr bundle. Emitted assets: ${Object.keys(assets).join(', ')} `);
        }
    });

    const matcher = typeof match === 'function' ? match : (ctx) => ctx.method === 'GET' && match.test(ctx.path);

    return (ctx, next) => {

        if (matcher(ctx)) {

            try {
                const {
                    html,
                    head = {},
                    template = 'default'
                } = render(ctx);

                const pageTmpl = getTemplate(template, templatePath);

                const output = pageTmpl({
                    html,
                    head,
                    webpack: manifest
                });

                ctx.body = output;
            } catch (e) {
                console.log(e); //eslint-disable-line no-console
            }
        }

        return next();
    };
};

module.exports = ssrMiddleware;