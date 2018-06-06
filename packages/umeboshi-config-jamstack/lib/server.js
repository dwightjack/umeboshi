//const webpack = require('webpack');
const createServer = require('umeboshi-config-spa/server')();
const SseChannel = require('sse-channel');
const http = require('http');
/*const config = require('umeboshi-scripts/webpack')({
    analyze: false, production: false, server: true, target: 'node'
});*/
const address = require('ip').address();

const ssrMiddleware = require('../lib/ssr.middleware');
const sseClientMiddleware = require('../lib/sse.middleware');
const sseReloadMiddleware = require('../lib/sse-reload.middleware');

//const compiler = webpack(config);


const jamServe = ({ templatePath, compiler }) => {

    const sse = new SseChannel({
        cors: { origins: ['*'] },
        jsonEncode: true
    });

    return {
        watcher: null,
        server: null,
        start(port, cb) {

            const app = createServer({
                middlewares: [
                    ssrMiddleware({
                        templatePath,
                        compiler
                    }),
                    sseClientMiddleware(
                        `http://${address}:${port}`
                    )
                ]
            });

            const callback = app.callback();
            const ssemw = sseReloadMiddleware(sse);
            let isFirst = true;

            this.watcher = compiler.watch(
                {},
                (err, stats) => {

                    if (isFirst) {

                        this.server = http.createServer((req, res) => {
                            ssemw(req, res, () => callback(req, res));
                        });

                        this.server.listen(port, cb);
                        isFirst = false;
                        return;
                    }

                    const data = stats.toJson('minimal');
                    sse.send({ data, event: 'reload' });
                }
            );
        },
        stopWatcher() {
            if (this.watcher) {
                return new Promise((resolve) => {
                    this.watcher.close(resolve);
                    this.watcher = null;
                });

            }
            return Promise.resolve();
        },
        stopServer() {
            if (this.server) {
                return new Promise((resolve) => {
                    this.server.stop(resolve);
                    this.server = null;
                });
            }
            return Promise.resolve();
        },
        stop(cb) {
            Promise.all([
                this.stopWatcher(),
                this.stopServer()
            ]).then(cb);
        }
    };
};

module.exports = jamServe;