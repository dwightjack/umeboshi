const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { paths } = require('umeboshi-dev-utils');

const baseConf = require('./webpack.base');

module.exports = (env) => {
    const config = baseConf(env);

    config
        .cache(true)
        .entry('app')
            .add(`.${path.sep}${paths.toPath('./src.assets/styles/index.js')}`) //eslint-disable-line indent
            .add(`.${path.sep}${paths.toPath('./src.assets/js/app.js')}`); //eslint-disable-line indent

    config.output
        .filename(paths.toPath('js/[name].[chunkhash].js'))
        .chunkFilename(paths.toPath('js/[name].[chunkhash].js'));

    /* eslint-disable indent */

    config.optimization
        .minimizer([
            new UglifyJSPlugin({
                uglifyOptions: {
                    compressor: {
                        warnings: false
                    }
                },
                sourceMap: true
            }),
            new OptimizeCssAssetsPlugin({
                canPrint: false,
                cssProcessorOptions: {
                    safe: true,
                    autoprefixer: { disable: true },
                    mergeLonghand: false
                }
            })
        ]);

    config
        .plugin('hashed-modules')
            .use(webpack.HashedModuleIdsPlugin)
            .end()
        .plugin('extract')
            .use(MiniCssExtractPlugin, [{
                chunkFilename: paths.toPath('styles/[name].[contenthash:10].css'),
                filename: paths.toPath('styles/[name].[contenthash:10].css')
            }])
            .end();
    /* eslint-enable indent */
    return config;
};