const webpack = require('webpack');
const portfinder = require('portfinder');
const logger = require('umeboshi-dev-utils/lib/logger');
const webpackConfig = require('umeboshi-scripts/webpack')({
    analyze: false, production: false, server: true, target: 'node'
});
const { resolveConfig } = require('umeboshi-dev-utils');
const createConfig = require('umeboshi-dev-utils/lib/config');

const jamServe = require('../lib/server');

const { config, api } = resolveConfig(createConfig({})).evaluate();

const compiler = webpack(webpackConfig);

const server = jamServe({
    compiler,
    index: config.jamstack.index,
    templatePath: api.paths.toAbsPath('tmp/templates')
});

portfinder.getPortPromise({ port: config.jamstack.port || 9000 })
    .then((port) => {
        server.start(port, () => {
            logger.message(`\nRendering server started at: http://${api.address}:${port}\n`);
        });
    });