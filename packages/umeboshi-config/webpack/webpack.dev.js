module.exports = (api, env) => {
    const {
        NamedChunksPlugin,
        HotModuleReplacementPlugin
    } = require('webpack');
    const config = require('./webpack.base')(api, env);

    config.plugin('named-chunks').use(NamedChunksPlugin);

    if (env.server) {
        config.plugin('hmr').use(HotModuleReplacementPlugin);
    }

    return config;
};
