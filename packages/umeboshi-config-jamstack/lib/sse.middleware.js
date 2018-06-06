const fs = require('fs');
const path = require('path');

let clientScript = fs.readFileSync(path.resolve(__dirname, './client.js'), { encoding: 'utf8' });

clientScript = clientScript.replace(/[\n\s]+/g, ' ');

const sseClientMiddleware = (ctx, next) => {
    if (ctx.body && ctx.body.includes('</head>')) {
        ctx.body = ctx.body.replace('</head>', `<script>${clientScript}</script>`);
    }
    return next();
};

module.exports = sseClientMiddleware;