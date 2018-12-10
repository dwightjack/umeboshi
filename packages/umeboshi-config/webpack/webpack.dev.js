module.exports = (api, env) => {
    const path = require('path');
    const {
        NamedChunksPlugin,
        HotModuleReplacementPlugin
    } = require('webpack');
    const config = require('./webpack.base')(api, env);
    const { paths } = api;

    config
        .cache(true)
        .entry('app')
        .add(`.${path.sep}${paths.toPath('./src.assets/styles/index.js')}`)
        .add(`.${path.sep}${paths.toPath('./src.assets/js/app.js')}`);

    config.plugin('named-chunks').use(NamedChunksPlugin);

    if (env.server) {
        config.plugin('hmr').use(HotModuleReplacementPlugin);
    }

    return config;
};
