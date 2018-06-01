const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
//const StartServerPlugin = require('start-server-webpack-plugin');

module.exports = (config, env = {}) => {

    const { paths } = require('umeboshi-dev-utils');

    config.plugins.delete('html');

    config
        .externals(nodeExternals({
            // whitelist: [
            //     env.server ? 'webpack/hot/poll?300' : null
            // ].filter((x) => x)
        }));


    config.node
        .clear().merge({
            console: false,
            global: false,
            process: false,
            Buffer: false,
            __filename: false,
            __dirname: false
        });

    config.target('node');

    config.cache(false);

    config.plugins
        .delete('html');
    config.plugin('single-chunk')
        .use(webpack.optimize.LimitChunkCountPlugin, [{ maxChunks: 1 }]);

    config.optimization
        .occurrenceOrder(true)
        .noEmitOnErrors(false)
        .runtimeChunk(false)
        .splitChunks({
            cacheGroups: {
                default: false,
                vendors: false //disable vendor splitting(not sure if you want it)
            },
            chunks: 'all'
        });


    config.module
        .rule('css').use('css-loader').loader(require.resolve('css-loader/locals'));
    config.module
        .rule('scss').use('css-loader').loader(require.resolve('css-loader/locals'));

    const serverEntry = env.server ? './src.assets/js/ssr.js' : './src.assets/js/render.js';

    config.entryPoints.clear();
    config.entry('ssr').add(`.${path.sep}${paths.toPath(serverEntry)}`);

    config.output.merge({
        path: paths.toAbsPath('tmp'),
        libraryTarget: 'commonjs2',
        chunkFilename: 'js/[name].js',
        filename: '[name].js'
    });

    if (env.server) {
        /* eslint-disable indent */

        const nodeArgs = [];

        // Add --inspect or --inspect-brk flag when enabled
        if (process.env.INSPECT_BRK_ENABLED) {
            nodeArgs.push('--inspect-brk');
        } else if (process.env.INSPECT_ENABLED) {
            nodeArgs.push('--inspect');
        }

        config.plugins.clear();

        config
            .watch(true)
            // .entry('ssr')
            //     .prepend('webpack/hot/poll?300')
            //     .end()
            // .plugin('ssr-server')
            //     .use(StartServerPlugin, ['ssr.js'])
            //     .end()
            // .plugin('ssr-hot')
            //     .use(webpack.HotModuleReplacementPlugin)
            //     .end()

            .plugin('ignore')
                .use(webpack.WatchIgnorePlugin, [[/manifest.json/]]);

        /* eslint-enable indent */
    }

    return config;
};