const path = require('path');
const globby = require('globby');
const makeDir = require('make-dir');
const fs = require('fs');
const { getTemplate } = require('../lib/utils');

const { resolveConfig } = require('umeboshi-dev-utils');
const createConfig = require('umeboshi-dev-utils/lib/config');

const { api } = resolveConfig(createConfig({})).evaluate();

let render;

if (process.env.SSR) {
    render = require(process.env.SSR).render; //eslint-disable-line prefer-destructuring
}

const templatePath = api.paths.toAbsPath('src.root/templates/');
const manifest = process.env.MANIFEST && require(process.env.MANIFEST);


globby.sync(
    ['**/*.js'],
    { cwd: api.paths.toAbsPath('src.assets/js/pages') }
).forEach((page) => {

    const {
        html,
        head = {},
        template = 'default'
    } = render({ path: page });

    const pageTmpl = getTemplate(template, templatePath);

    const output = pageTmpl({
        html,
        head,
        assets: manifest
    });

    const outPath = api.paths.toAbsPath(`dist.root/${page.replace(/\.js$/, '.html')}`);

    makeDir.sync(path.dirname(outPath));

    fs.writeFileSync(
        outPath,
        output,
        { encoding: 'utf8' }
    );

    console.log(`Rendered file ${path.relative(api.paths.toAbsPath('dist.root'), outPath)}`);
});