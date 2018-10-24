const fs = require('fs');
const path = require('path');

const readFileAsync = (filename, opts) =>
    new Promise((resolve, reject) => {
        fs.readFile(filename, opts, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });

const readClientScript = (host) => {
    const filepath = path.resolve(__dirname, '../client/sse.js');
    return readFileAsync(filepath, 'utf8').then((src) =>
        src.replace(/[\n\s]+/g, ' ').replace('{{HOST}}', host)
    );
};

const sseClientMiddleware = (host = '') => {
    const clientScript = readClientScript(host);

    return (req, res, next) => {
        clientScript
            .then((src) => {
                if (res.body && res.body.includes('</head>')) {
                    res.body = res.body.replace(
                        '</head>',
                        `<script>${src}</script>`
                    );
                }
                next();
            })
            .catch((err) => next(err));
    };
};

module.exports = sseClientMiddleware;
