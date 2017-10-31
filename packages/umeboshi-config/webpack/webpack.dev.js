const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const { loadConfig } = require('umeboshi-dev-utils');

const paths = loadConfig('paths.js');
const webpackConf = loadConfig('webpack/webpack.base.js');

module.exports = merge.smart(webpackConf, {
    entry: {
        app: [
            `.${path.sep}${paths.toPath('./src.assets/styles/index.js')}`,
            `.${path.sep}/${paths.toPath('./src.assets/js/app.js')}`
        ]
    },

    cache: true,

    plugins: [

        new webpack.NamedModulesPlugin(),
        new webpack.NamedChunksPlugin(),

        new HtmlWebpackPlugin({
            template: paths.toPath('src.root/templates/index.ejs'),
            inject: true,
            minify: false,
            filename: paths.toAbsPath('dist.root/index.html'),
            modernizr: paths.assetsPath('vendors/modernizr/modernizr.*'),
            chunksSortMode: 'dependency'
        })
    ]
});