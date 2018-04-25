const webpack = require('webpack');
const serverConf = require('umeboshi-config/webpack/webpack.server');

module.exports = (env, cfg) => {

    const config = serverConf(env, cfg);

    config.entry('app')
    .add('webpack/hot/only-dev-server');

    config.devServer
        .hot(true);

    config.plugin('hmr')
        .use(webpack.HotModuleReplacementPlugin);

    return config;

};