const webpack = require('webpack');
const portfinder = require('portfinder');
const { green } = require('chalk');
const WebpackDevServer = require('webpack-dev-server');
const {
    loadConfig, paths, loadUmeboshiConfig, mergeConfig
} = require('umeboshi-dev-utils');
const { middlewares, localhost, address } = require('umeboshi-dev-utils/lib/server');
const { port } = localhost;

const serverConf = loadConfig('webpack/webpack.server.js');
let devConf = loadConfig('webpack/webpack.dev.js')();
const umeDevServer = loadUmeboshiConfig('devServer');

if (Array.isArray(devConf)) {
    devConf = devConf.find((config) => config.get('target') === 'web');
}

if (!devConf) {
    throw new TypeError('Invalid webpack configuration');
}

const templatePath = paths.toAbsPath('dist.root/index.html');

//get the port and start the server
portfinder.getPortPromise({ port }).then((p) => {
    const webpackConfig = serverConf({ port: p }, devConf);

    const config = mergeConfig(webpackConfig, umeDevServer).toConfig();
    const { devServer, stats } = config;

    delete config.devServer;

    const compiler = webpack(config);

    const devServerConf = Object.assign({
        after(app) {
            if (middlewares.length > 0) {
                middlewares.forEach((middleware) => app.use(middleware));
            }
        }
    }, devServer, { stats });

    const server = new WebpackDevServer(compiler, devServerConf);

    server.app.get('*', (req, res) => {
        compiler.outputFileSystem.readFile(templatePath, (err, file) => {
            if (err) {
                res.sendStatus(404);
            } else {
                res.end(file.toString());
            }
        });
    });

    server.middleware.waitUntilValid(() => {
        console.log(green(`\nStarted a server at http://${address}:${p}\n`)); //eslint-disable-line no-console
    });

    server.listen(p, (err) => {
        if (err) {
            console.error(err); //eslint-disable-line no-console
        }
    });

});