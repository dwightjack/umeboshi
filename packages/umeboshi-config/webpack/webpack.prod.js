const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const merge = require('webpack-merge');
const { loadConfig } = require('umeboshi-dev-utils');

const webpackConf = loadConfig('webpack/webpack.base.js');
const paths = loadConfig('paths.js');

module.exports = merge.smart(webpackConf, {
    entry: {
        app: [
            `.${path.sep}${paths.toPath('./src.assets/styles/index.js')}`,
            `.${path.sep}/${paths.toPath('./src.assets/js/app.js')}`
        ]
    },

    output: {
        filename: paths.toPath('js/[name].[chunkhash].js'),
        chunkFilename: paths.toPath('js/[name].[chunkhash].chunk.js')
    },

    plugins: [

        new webpack.HashedModuleIdsPlugin(),

        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compressor: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),

        new ExtractTextPlugin({
            allChunks: true,
            filename: paths.toPath('styles/[name].[contenthash:10].css')
        }),

        new HtmlWebpackPlugin({
            template: paths.toPath('src.root/templates/index.ejs'),
            filename: paths.toAbsPath('dist.root/index.html'),
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: false,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            },
            modernizr: paths.assetsPath('vendors/modernizr/modernizr.*'),
            inject: true,
            chunksSortMode: 'dependency'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendors']
        })
    ]
});