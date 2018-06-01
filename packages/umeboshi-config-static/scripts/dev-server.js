const webpack = require('webpack');
const portfinder = require('portfinder');
const { green } = require('chalk');
const serve = require('webpack-serve');
const {
    loadConfig, loadUmeboshiConfig, mergeConfig, toWebpackConfig
} = require('umeboshi-dev-utils');
const { localhost, address } = require('umeboshi-dev-utils/lib/server');
const { port } = localhost;

const serverConf = loadConfig('server/dev.js');
const config = require('umeboshi-scripts/webpack')({ analyze: false, production: false, server: true });

const { devServer } = loadUmeboshiConfig();


if (!Array.isArray(config)) {
    throw new TypeError('You must provide two configuration: client and server');
}

const [clientConfig, serverConfig] = toWebpackConfig(config);

//get the port and start the server
portfinder.getPortPromise({ port })
    .then((p) => {
        return Promise.all([
            p, portfinder.getPortPromise({ port: (p + 1) })
        ]);
    }).then(([serverPort, clientPort]) => {

        const clientCompiler = webpack(clientConfig);
        const options = Object.assign(
            mergeConfig(serverConf({ port: p }, clientConfig), devServer, clientCompiler),
            { compiler: clientCompiler }
        );

        const serverCompiler = webpack(serverConfig);

        clientCompiler.plugin('done', () => {

            console.log(serverConfig);

            serverCompiler.watch(
                {},
                (stats) => { // eslint-disable-line no-unused-vars
                    console.log('xxxx');
                }
            );
        });


        serve(options).then((server) => {
            server.on('listening', () => {
                console.log(green('`\nStarted a server at:\n')); //eslint-disable-line no-console
                console.log(green(`- http://localhost:${serverPort}`)); //eslint-disable-line no-console
                console.log(green(`- http://${address}:${serverPort}\n`)); //eslint-disable-line no-console
            });
        });

    });

