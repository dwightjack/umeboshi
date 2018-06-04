const fs = require('fs');
const webpack = require('webpack');
const createServer = require('umeboshi-config-spa/server');
const SseChannel = require('sse-channel');
const {
    resolveConfig
} = require('umeboshi-dev-utils');
const config = require('umeboshi-scripts/webpack')({ analyze: false, production: false, server: true });

const clientScript = fs.readFileSync('./lib/client.js', { encoding: 'utf8' });

const serverCompiler = webpack(config);
const sse = new SseChannel({
    cors: { origins: ['*'] }
});

const sseMiddleware = ({ req, res }, next) => {
    if (req.url.indexOf('/channel/ssr-server') === 0) {
        sse.addClient(req, res);
        return Promise.resolve();
    }
    return next();
};

const sseClientMiddleware = (ctx, next) => {
    if (ctx.body && ctx.body.includes('</head>')) {
        ctx.body = ctx.body.replace('</head>', `<script>${clientScript}</script>`);
    }
    return next();
};

const htmlMiddleware = (ctx, next) => {
    if (ctx.method === 'GET' && /(\/|\.html)$/.test(ctx.path)) {
        return `<!DOCTYPE html>
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
        sseMiddleware,
        htmlMiddleware,
        sseClientMiddleware
    ]
});

serverCompiler.plugin('done', () => {

    serverCompiler.watch(
        {},
        (stats) => {
            sse.send({ data: stats.toString(), event: 'reload' })
        }
    );
});


app.listen(8080, () => {
    console.log('listening...');
});