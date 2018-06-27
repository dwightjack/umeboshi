const fs = require('fs');
const path = require('path');
const makeDir = require('make-dir');
const { resolveConfig } = require('umeboshi-dev-utils');
const logger = require('umeboshi-dev-utils/lib/logger');
const createConfig = require('umeboshi-dev-utils/lib/config');
const { getTemplate } = require('../lib/utils');

const { config, api } = resolveConfig(createConfig({})).evaluate();

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

        const output = pageTmpl({
            html,
            head
        });

        const pagePath = path.join(page, page.endsWith('index') ? '' : 'index');
        const outPath = path.normalize(api.paths.toAbsPath(`dist.root/${pagePath}.html`));

        try {
            makeDir.sync(path.dirname(outPath));

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