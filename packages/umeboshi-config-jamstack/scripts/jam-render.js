const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
const { resolveConfig } = require('umeboshi-dev-utils');
const logger = require('umeboshi-dev-utils/lib/logger');
const createConfig = require('umeboshi-dev-utils/lib/config');
const { getTemplate } = require('../lib/utils');

const { api } = resolveConfig(createConfig({})).evaluate();

let render;
let router;

if (process.env.SSR) {
    render = require(process.env.SSR).render; //eslint-disable-line prefer-destructuring
    router = require(process.env.SSR).router; //eslint-disable-line prefer-destructuring
}

const templatePath = api.paths.toAbsPath('tmp/templates/');

router.routes.forEach(async (page) => {
    try {
        const { html, head = {}, template } = await render(page);
        const pageTmpl = getTemplate(template, templatePath);

        let output = pageTmpl({
            html,
            head
        });

        const pagePath = path.join(
            page.path,
            page.path.endsWith('index') ? '' : 'index'
        );
        const outPath = path.normalize(
            api.paths.toAbsPath(`dist.root/${pagePath}.html`)
        );

        await makeDir(path.dirname(outPath));

        if (process.env.MINIFY) {
            const { minify } = require('html-minifier');
            output = minify(output, {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: false,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            });
        }

        fs.writeFileSync(outPath, output, 'utf8');

        logger.message(
            `Rendered file ${path.relative(
                api.paths.toAbsPath('dist.root'),
                outPath
            )}`
        );
    } catch (e) {
        logger.error(e);
    }
});
