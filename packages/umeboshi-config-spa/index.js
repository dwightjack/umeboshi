const {
    historyMiddleware,
    spaRenderMiddleware,
    staticMiddleware
} = require('./middlewares');

module.exports = (config) => {
    const { server } = config.get('env');

    config.set('middlewares', (api) => {
        const templatePath = api.paths.toAbsPath('dist.root/index.html');

        return [
            historyMiddleware(),
            staticMiddleware(api.paths.toAbsPath('dist.root')),
            server && spaRenderMiddleware({ templatePath })
        ].filter((x) => x);
    });

    config.set('createServer', require('./server'));
};
