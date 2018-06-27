const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

const readClientScript = (host) => {
    const filepath = path.resolve(__dirname, '../client/sse.js');
    return readFileAsync(filepath, { encoding: 'utf8' }).then((src) => (
        src.replace(/[\n\s]+/g, ' ').replace('{{HOST}}', host)
    ));
};

const sseClientMiddleware = (host = '') => {

    const clientScript = readClientScript(host);

    return (ctx, next) => {
        return next().then(() => clientScript).then((src) => {
            if (ctx.body && ctx.body.includes('</head>')) {
                ctx.body = ctx.body.replace('</head>', `<script>${src}</script>`);
            }
        });
    };
};

module.exports = sseClientMiddleware;