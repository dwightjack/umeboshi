const webpack = require('webpack');
const portfinder = require('portfinder');
const { green } = require('chalk');
const serve = require('webpack-serve');
const {
    loadConfig, paths, loadUmeboshiConfig, mergeConfig
} = require('umeboshi-dev-utils');
const { middlewares, localhost, address } = require('umeboshi-dev-utils/lib/server');
const { spaMode } = require('./lib/server');
const { port } = localhost;

const serverConf = loadConfig('server/dev.js');
let config = require('./webpack')({ analyze: false, production: false });

const { devServer, appMode = 'spa' } = loadUmeboshiConfig();


if (Array.isArray(config)) {
    config = config.find(({ target }) => target === 'web');
}

if (!config) {
    throw new TypeError('Invalid webpack configuration');
}

//get the port and start the server
portfinder.getPortPromise({ port }).then((p) => {
    const compiler = webpack(config);
    const options = Object.assign(
        {
            add(app) {
                if (middlewares.length > 0) {
                    middlewares.forEach((middleware) => app.use(middleware));
                }

                if (appMode === 'spa') {
                    const template = paths.toAbsPath('dist.root/index.html');
                    const render = () => new Promise((resolve, reject) => {
                        compiler.outputFileSystem.readFile(template, (err, file) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(file.toString());
                            }
                        });
                    });

                    spaMode(app, render);
                }

            }
        },
        mergeConfig(serverConf({ port: p, publicPath: config.output.publicPath }, config), devServer, compiler),
        { compiler }
    );

    serve(options).then((server) => {
        server.on('listening', () => {
            console.log(green(`\nStarted a server at http://${address}:${p}\n`)); //eslint-disable-line no-console
        });
    });

});