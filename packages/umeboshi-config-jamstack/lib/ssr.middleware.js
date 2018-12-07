const fs = require('fs');
const path = require('path');
const uncached = require('import-fresh');
const logger = require('umeboshi-dev-utils/lib/logger');
const { getTemplate } = require('./utils');

const readSSEClientScript = (host = '') => {
    const filepath = path.resolve(__dirname, '../client/sse.js');
    const src = fs.readFileSync(filepath, 'utf8');
    return src.replace(/[\n\s]+/g, ' ').replace('{{HOST}}', host);
};

const ssrMiddleware = ({ templatePath, compiler, match = /(\/|\.html?)$/ }) => {
    let render;

    compiler.hooks.afterEmit.tap('reloadBundle', ({ assets }) => {
        const bundle = Object.keys(assets)
            .filter((k) => !!assets[k].emitted)
            .find((k) => k.endsWith('.js'));

        if (bundle) {
            try {
                render = uncached(assets[bundle].existsAt).render; //eslint-disable-line prefer-destructuring
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

    const sseScript = readSSEClientScript();

    return async (req, res, next) => {
        if (matcher(req)) {
            try {
                const { html, head = {}, template } = await render(req);
                const pageTmpl = getTemplate(template, templatePath);

                const output = pageTmpl({
                    html,
                    head
                }).replace('</head>', `<script>${sseScript}</script></head>`);

                res.send(output);
            } catch (e) {
                logger.error(e);
                next(e);
            }
            return;
        }
        next();
    };
};

module.exports = ssrMiddleware;
