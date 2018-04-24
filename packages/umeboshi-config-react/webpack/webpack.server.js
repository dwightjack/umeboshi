const webpack = require('webpack');
const serverConf = require('umeboshi-config/webpack/webpack.server');

module.exports = (env, cfg) => {

    const config = serverConf(env, cfg);

    //eventsource-polyfill must be at the beginning
    const entries = config.entry('app').delete('eventsource-polyfill').values();

    config.entry('app').clear().merge([
        'eventsource-polyfill', // Necessary for hot reloading with IE
        'react-hot-loader/patch',
        ...entries,
        'webpack/hot/only-dev-server'
    ]);

    config.devServer
        .hot(true);

    config.plugin('hmr')
        .use(webpack.HotModuleReplacementPlugin);

};