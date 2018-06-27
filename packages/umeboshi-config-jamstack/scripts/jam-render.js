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

Object.keys(router.routes).forEach((page) => {

    render({ path: page }).then(({
        html,
        head = {},
        template
    }) => {
        const pageTmpl = getTemplate(template, templatePath);

        let output = pageTmpl({
            html,
            head
        });

        const pagePath = path.join(page, page.endsWith('index') ? '' : 'index');
        const outPath = path.normalize(api.paths.toAbsPath(`dist.root/${pagePath}.html`));

        try {
            makeDir.sync(path.dirname(outPath));

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

            fs.writeFileSync(
                outPath,
                output,
                { encoding: 'utf8' }
            );
            return Promise.resolve(outPath);
        } catch (e) {
            return Promise.reject(e);
        }


    }).then((outPath) => {
        logger.message(`Rendered file ${path.relative(api.paths.toAbsPath('dist.root'), outPath)}`);
    }).catch((e) => {
        logger.error(e);
    });

});