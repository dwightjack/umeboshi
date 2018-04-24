const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { paths } = require('umeboshi-dev-utils');

const baseConf = require('./webpack.base');

module.exports = (env) => {
    const config = baseConf(env);

    config
        .cache(true)
        .entry('app')
            .add(`.${path.sep}${paths.toPath('./src.assets/styles/index.js')}`) //eslint-disable-line indent
            .add(`.${path.sep}/${paths.toPath('./src.assets/js/app.js')}`); //eslint-disable-line indent

    config.output
        .filename(paths.toPath('js/[name].[chunkhash].js'))
        .chunkFilename(paths.toPath('js/[name].[chunkhash].chunk.js'));

    /* eslint-disable indent */
    config
        .plugin('hashed-modules')
            .use(webpack.HashedModuleIdsPlugin)
            .end()
        .plugin('uglify')
            .use(webpack.optimize.UglifyJsPlugin, [{
                sourceMap: true,
                compressor: {
                    warnings: false
                }
            }])
            .end()
        .plugin('loader-options')
            .use(webpack.LoaderOptionsPlugin, [{
                minimize: true
            }])
            .end()
        .plugin('extract')
            .use(ExtractTextPlugin, [{
                allChunks: true,
                filename: paths.toPath('styles/[name].[contenthash:10].css')
            }])
            .end()
        .plugin('manifest')
            .use(webpack.optimize.CommonsChunkPlugin, [{
                name: 'manifest',
                chunks: ['vendors']
            }])
            .end();
    /* eslint-enable indent */
    return config;
};