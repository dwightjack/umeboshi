const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const merge = require('webpack-merge');
const { loadConfig } = require('umeboshi-scripts/lib/utils');

const paths = loadConfig('paths.js');
const webpackConf = loadConfig('webpack/webpack.base.js');

module.exports = merge.smart(webpackConf, {
    entry: {
        app: [
            './' + paths.toPath('src.assets/styles') + '/index.js',
            './' + paths.toPath('src.assets/js') + '/app.js'
        ]
    },

    cache: true,

    plugins: [

        new webpack.NamedModulesPlugin(),
        new webpack.NamedChunksPlugin(),

        new HtmlWebpackPlugin({
            template: paths.toPath('src.root/templates') + '/index.ejs',
            inject: true,
            minify: false,
            filename: paths.toAbsPath('dist.root') + '/index.html',
            modernizr: paths.assetsPath('vendors/modernizr/modernizr.*'),
            chunksSortMode: 'dependency'
        }),
        new ScriptExtHtmlWebpackPlugin({
            //@see https://calendar.perfplanet.com/2016/prefer-defer-over-async/
            defaultAttribute: 'defer'
        })
    ]
});