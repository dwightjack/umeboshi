const fs = require('fs');

let clientScript = fs.readFileSync('./lib/client.js', { encoding: 'utf8' });

clientScript = clientScript.replace(/[\n\s]+/g, ' ');

const sseClientMiddleware = (ctx, next) => {
    if (ctx.body && ctx.body.includes('</head>')) {
        ctx.body = ctx.body.replace('</head>', `<script>${clientScript}</script>`);
    }
    return next();
};

module.exports = sseClientMiddleware;