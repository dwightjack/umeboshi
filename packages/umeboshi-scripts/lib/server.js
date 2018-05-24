const Koa = require('koa');
const serveStatic = require('@shellscape/koa-static/legacy');
const convert = require('koa-connect');
const history = require('connect-history-api-fallback');
const { middlewares } = require('umeboshi-dev-utils/lib/server');

const historyMiddleware = (conf) => convert(history(conf));

const spaMode = (app, render) => {
    app.use(historyMiddleware());

    app.get('/index.html', (req, res) => {
        render(req)
            .then((html) => res.end(html))
            .catch(() => res.sendStatus(404));
    });
};

const createServer = ({
    contentBase,
    appMode = 'spa'
} = {}) => {
    const app = new Koa();

    if (appMode === 'spa') {
        app.use(historyMiddleware());
    }

    if (contentBase) {
        app.use(serveStatic(contentBase));
    }


    if (middlewares.length > 0) {
        middlewares.forEach((middleware) => app.use(middleware));
    }

    return app;
};



module.exports = {
    createServer,
    historyMiddleware,
    spaMode
};