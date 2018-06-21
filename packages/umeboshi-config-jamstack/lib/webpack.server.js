const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
//const StartServerPlugin = require('start-server-webpack-plugin');

module.exports = (config, { paths }, env = {}) => {

    config.plugins.delete('html');

    config
        .externals(nodeExternals({
            whitelist: [
                /^umeboshi-config-jamstack/
            ].filter((x) => x)
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


    ['css', 'scss'].forEach((lang) => {
        const rule = config.module.rule(lang);

        //we don't need this on the server
        rule.uses.delete('style-loader');
        //just export a reference for css modules (if used)
        if (rule.use('css-loader').has('options')) {
            const { modules } = rule.use('css-loader').get('options');
            if (modules) {
                rule.use('css-loader').loader(require.resolve('css-loader/locals'));
            }
        }
    });

    config.entryPoints.clear();
    config.entry('ssr').add(`.${path.sep}${paths.toPath('./src.assets/js/render.js')}`);

    config.output.merge({
        path: paths.toAbsPath('tmp'),
        libraryTarget: 'commonjs2',
        chunkFilename: 'js/[name].js',
        filename: '[name].js'
    });

    if (env.server) {
        /* eslint-disable indent */

        //config.plugins.clear();
        [...config.plugins.store]
            .forEach(([key]) => {
                if (key !== 'define') {
                    config.plugins.delete(key);
                }
            });

        config
            .watch(true)
            .plugin('ignore')
                .use(webpack.WatchIgnorePlugin, [[/manifest\.json/]]);

        /* eslint-enable indent */
    }
};