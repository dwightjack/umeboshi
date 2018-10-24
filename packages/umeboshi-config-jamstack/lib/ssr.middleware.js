const requireUncached = require('require-uncached');
const logger = require('umeboshi-dev-utils/lib/logger');
const { getTemplate } = require('./utils');

const ssrMiddleware = ({ templatePath, compiler, match = /(\/|\.html?)$/ }) => {
    let render;

    compiler.hooks.afterEmit.tap('reloadBundle', ({ assets }) => {
        const bundle = Object.keys(assets)
            .filter((k) => !!assets[k].emitted)
            .find((k) => k.endsWith('.js'));

        if (bundle) {
            try {
                render = requireUncached(assets[bundle].existsAt).render; //eslint-disable-line prefer-destructuring
            } catch (e) {
                logger.error(e);
            }
        } else {
            logger.warning(
                `Unable to find ssr bundle. Emitted assets: ${Object.keys(
                    assets
                ).join(', ')} `
            );
        }
    });

    const matcher =
        typeof match === 'function'
            ? match
            : (req) => req.method === 'GET' && match.test(req.path);

    return (req, res, next) => {
        if (matcher(req)) {
            render(req)
                .then(({ html, head = {}, template }) => {
                    const pageTmpl = getTemplate(template, templatePath);

                    const output = pageTmpl({
                        html,
                        head
                    });

                    res.send(output);
                })
                .catch((e) => {
                    logger.error(e);
                    next(e);
                });
            return;
        }
        next();
    };
};

module.exports = ssrMiddleware;
