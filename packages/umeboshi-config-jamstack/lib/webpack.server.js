const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const WebpackRenderPlugin = require('./webpack-render-plugin');

module.exports = (config, { paths }, env = {}) => {
    config.plugins.delete('html');

    config.set('name', 'server-jamstack');

    config.externals(
        nodeExternals({
            whitelist: [/^umeboshi-config-jamstack/, /\.s?css$/]
        })
    );

    config.node.clear().merge({
        console: false,
        global: false,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false
    });

    config.target('node');

    config.cache(false);

    config
        .plugin('single-chunk')
        .use(webpack.optimize.LimitChunkCountPlugin, [{ maxChunks: 1 }]);

    config.optimization
        .occurrenceOrder(true)
        .noEmitOnErrors(false)
        .runtimeChunk(false)
        .splitChunks({
            cacheGroups: {
                default: false,
                vendors: false
            },
            chunks: 'all'
        });
    config.optimization.delete('minimizer');

    ['css', 'scss'].forEach((lang) => {
        if (!config.module.rules.has(lang)) {
            return;
        }
        const rule = config.module.rule(lang);

        //we don't need this on the server
        rule.uses.delete('style-loader');
        //just export a reference for css modules (if used)
        if (rule.use('css-loader').has('options')) {
            const { modules } = rule.use('css-loader').get('options');
            if (modules) {
                rule.use('css-loader').loader(
                    require.resolve('css-loader/locals')
                );
            }
        }
    });

    config.entryPoints.clear();
    config
        .entry('ssr')
        .add(
            env.jamstackSSR ||
                `.${path.sep}${paths.toPath('./src.assets/js/ssr.js')}`
        );

    config.output.merge({
        path: paths.toAbsPath('tmp'),
        libraryTarget: 'commonjs2',
        chunkFilename: 'js/[name].js',
        filename: '[name].js'
    });

    if (env.server) {
        /* eslint-disable indent */

        //config.plugins.clear();
        [...config.plugins.store].forEach(([key]) => {
            if (key !== 'define') {
                config.plugins.delete(key);
            }
        });

        config.watch(true);
    } else {
        config.plugin('jamstack').use(WebpackRenderPlugin, [
            {
                minify: !!env.production
            }
        ]);
    }

    if (env.production) {
        config.plugins.delete('extract');
    }
    /* eslint-enable indent */
};
