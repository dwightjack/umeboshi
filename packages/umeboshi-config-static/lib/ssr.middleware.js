const requireUncached = require('require-uncached');
const fs = require('fs');
const tmpl = require('lodash/template');

const toTemplatePath = (template, tmplPath) => `${tmplPath}/${template}.ejs`;

const getTemplate = (template, tmplPath, def = 'default') => {
    let t = toTemplatePath(template, tmplPath);
    if (fs.existsSync(t) === false) {
        t = toTemplatePath(def, tmplPath);
    }
    return tmpl(fs.readFileSync(t, { encoding: 'utf8' }));
};

const ssrMiddleware = ({
    bundlePath,
    templatePath,
    serverCompiler
}) => {

    let render;

    serverCompiler.hooks.afterEmit.tap('reloadBundle', () => {
        render = requireUncached(bundlePath).render; //eslint-disable-line prefer-destructuring
    });

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
                html,
                head = {},
                template = 'default'
            } = render({
                page
            });

            const pageTmpl = getTemplate(template, templatePath);

            const output = pageTmpl({
                html,
                head,
                webpack: {},
                modernizr: false
            });

            ctx.body = output;
        }

        return next();
    };
};

module.exports = ssrMiddleware;