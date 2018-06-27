const fs = require('fs');
const path = require('path');
const globby = require('globby');
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

        const outPath = api.paths.toAbsPath(
            `dist.root/${page === config.jamstack.index ? 'index.html' : page.replace(/\.js$/, '.html')}`
        );
        makeDir.sync(path.dirname(outPath));

        fs.writeFileSync(
            outPath,
            output,
            { encoding: 'utf8' }
        );

        logger.message(`Rendered file ${path.relative(api.paths.toAbsPath('dist.root'), outPath)}`);

    });

});