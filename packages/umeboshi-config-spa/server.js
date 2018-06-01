const Koa = require('koa');

const createServer = ({
    //contentBase,
    middlewares = []
} = {}) => {
    const app = new Koa();

    if (middlewares.length > 0) {
        middlewares.forEach((middleware) => app.use(middleware));
    }

    return app;
};

module.exports = createServer;