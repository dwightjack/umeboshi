const express = require('express');

const createServer = ({
    //contentBase,
    middlewares = []
} = {}) => {
    const app = express();

    if (middlewares.length > 0) {
        middlewares.forEach((middleware) => app.use(middleware));
    }

    return app;
};

module.exports = () => createServer;
