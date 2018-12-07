const sseReloadMiddleware = (sse) => {
    return (req, res, next) => {
        if (req.url.startsWith('/channel/ssr-server')) {
            sse.addClient(req, res);
            sse.send({ event: 'attached' });
        } else {
            next();
        }
    };
};

module.exports = sseReloadMiddleware;
