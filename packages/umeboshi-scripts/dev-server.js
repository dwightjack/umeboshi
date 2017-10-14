const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const merge = require('webpack-merge');
const address = require('ip').address();

const { loadConfig, loadScript } = require('./lib/utils');

const paths = loadConfig('paths.js');
const localhost = loadConfig('hosts.js').local;
const middlewares = loadScript('middlewares');
const webpackConfig = Object.assign({}, loadConfig('webpack/webpack.server.js') || {});
const { devServer } = webpackConfig;

webpackConfig.devServer = null;

const config = merge.smart(webpackConfig, loadConfig('webpack/webpack.dev.js'));

const compiler = webpack(config);

const server = new WebpackDevServer(compiler, Object.assign({
    after(app) {
        if (middlewares.length > 0) {
            middlewares.forEach((middleware) => app.use(middleware));
        }
    }
}, (devServer || {}), { stats: config.stats }));

server.app.get('*', (req, res) => {
    compiler.outputFileSystem.readFile(paths.toAbsPath('dist.root') + '/index.html', (err, file) => {
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