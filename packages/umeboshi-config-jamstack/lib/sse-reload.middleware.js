const sseReloadMiddleware = (sse) => {

    return (req, res, next) => {
        if (req.url.indexOf('/channel/ssr-server') === 0) {
            sse.addClient(req, res);
            sse.send({ event: 'attached' });
        } else {
            next();
        }
    };
};

module.exports = sseReloadMiddleware;