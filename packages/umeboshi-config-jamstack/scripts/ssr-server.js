const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const createServer = require('umeboshi-config-spa/server')();
const SseChannel = require('sse-channel');
const http = require('http');
const config = require('umeboshi-scripts/webpack')({ analyze: false, production: false, server: true });

const ssrMiddleware = require('../lib/ssr.middleware');
let clientScript = fs.readFileSync(path.resolve(__dirname, '../lib/client.js'), { encoding: 'utf8' });

clientScript = clientScript.replace(/[\n\s]+/g, ' ');

const serverCompiler = webpack(config);
const sse = new SseChannel({
    cors: { origins: ['*'] },
    jsonEncode: true
});

const sseClientMiddleware = (ctx, next) => {
    if (ctx.body && ctx.body.includes('</head>')) {
        ctx.body = ctx.body.replace('</head>', `<script>${clientScript}</script>`);
    }
    return next();
};

const htmlMiddleware = (ctx, next) => {
    if (ctx.method === 'GET' && /(\/|\.html)$/.test(ctx.path)) {

        ctx.body = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>Document</title>
            </head>
            <body>
                <div>Test</div>
            </body>
            </html>`;
    }
    return next();
};

const app = createServer({
    middlewares: [
        ssrMiddleware({
            bundlePath: path.resolve(process.cwd(), '.tmp/ssr.js'),
            templatePath: path.resolve(process.cwd(), 'app/templates'),
            serverCompiler
        }),
        sseClientMiddleware
    ]
});

let isFirst = true;

const callback = app.callback();

serverCompiler.watch(
    {},
    (err, stats) => {

        if (isFirst) {
            http.createServer((req, res) => {
                if (req.url.indexOf('/channel/ssr-server') === 0) {
                    sse.addClient(req, res);
                    sse.send({ event: 'attached' });
                } else {
                    callback(req, res);
                }
            }).listen(8080);
            isFirst = false;
            return;
        }

        const data = stats.toJson('minimal');
        sse.send({ data, event: 'reload' });
    }
);