const {
    historyMiddleware,
    spaRenderMiddleware,
    staticMiddleware
} = require('./middlewares');

module.exports = (config, { server }) => {

    config.set('middlewares', (api) => {

        const templatePath = api.paths.toAbsPath('dist.root/index.html');

        return ({ compiler } = {}) => [
            historyMiddleware(),
            staticMiddleware(api.paths.toAbsPath('dist.root')),
            server && spaRenderMiddleware({ compiler, templatePath })
        ].filter((x) => x);
    });

    config.set('createServer', require('./server'));
};