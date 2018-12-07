const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (api, env) => {
    const config = require('./webpack.base')(api, env);
    const { paths } = api;

    config
        .cache(true)
        .entry('app')
        .add(`.${path.sep}${paths.toPath('./src.assets/styles/index.js')}`) //eslint-disable-line indent
        .add(`.${path.sep}${paths.toPath('./src.assets/js/app.js')}`); //eslint-disable-line indent

    config.output
        .filename(paths.toPath('js/[name].[chunkhash].js'))
        .chunkFilename(paths.toPath('js/[name].[chunkhash].js'));

    /* eslint-disable indent */

    config.optimization.minimizer('js').use(TerserPlugin);
    config.optimization
        .minimizer('css')
        .use(OptimizeCssAssetsPlugin, [
            { cssProcessorOptions: { safe: true } }
        ]);

    config
        .plugin('hashed-modules')
        .use(webpack.HashedModuleIdsPlugin)
        .end()
        .plugin('extract')
        .use(MiniCssExtractPlugin, [
            {
                chunkFilename: paths.toPath(
                    'styles/[name].[contenthash:10].css'
                ),
                filename: paths.toPath('styles/[name].[contenthash:10].css')
            }
        ])
        .end();
    /* eslint-enable indent */
    return config;
};
