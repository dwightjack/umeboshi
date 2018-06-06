const webpack = require('webpack');
const portfinder = require('portfinder');
const { green } = require('chalk');
const webpackConfig = require('umeboshi-scripts/webpack')({
    analyze: false, production: false, server: true, target: 'node'
});
const {
    resolveConfig, createConfig
} = require('umeboshi-dev-utils');

const jamServe = require('../lib/server');

const { config, api } = resolveConfig(createConfig({})).evaluate();

const compiler = webpack(webpackConfig);

const server = jamServe({
    compiler,
    templatePath: api.paths.toAbsPath('src.root/templates')
});

portfinder.getPortPromise({ port: config.jamstack.port || 9000 })
    .then((port) => {
        server.start(port, () => {
            console.log(green(`\nRendering server started at: http://${api.address}:${port}\n`)); //eslint-disable-line no-console
        });
    });