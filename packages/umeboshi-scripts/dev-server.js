const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const merge = require('webpack-merge');
const {
    loadConfig, paths, loadUmeboshiConfig, mergeConfig
} = require('umeboshi-dev-utils');
const { middlewares, localhost, address } = require('umeboshi-dev-utils/lib/server');

const serverConf = loadConfig('webpack/webpack.server.js');
const devConf = loadConfig('webpack/webpack.dev.js');
const $loaders = loadConfig('webpack/loaders.js');
const $plugins = loadConfig('webpack/plugins.js');


const webpackConfig = merge.smart(serverConf, devConf);
webpackConfig.module.rules.push(...$loaders.toLoaders());
webpackConfig.plugins.push(...$plugins.toPlugins());


const { devServer, stats } = webpackConfig;
const umeDevServer = loadUmeboshiConfig('devServer');

delete webpackConfig.devServer;

const compiler = webpack(webpackConfig);

const devServerConf = Object.assign({
    after(app) {
        if (middlewares.length > 0) {
            middlewares.forEach((middleware) => app.use(middleware));
        }
    }
}, devServer, { stats });

const server = new WebpackDevServer(compiler, mergeConfig(devServerConf, umeDevServer));

const templatePath = paths.toAbsPath('dist.root/index.html');

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
    console.log('\nStarted a server at http://%s:%s\n', address, localhost.port); //eslint-disable-line no-console
});

server.listen(localhost.port, (err) => {
    if (err) {
        console.log(err); //eslint-disable-line no-console
    }
});