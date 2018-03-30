const path = require('path');
const merge = require('webpack-merge');
const { paths } = require('umeboshi-dev-utils');

const webpackConf = require('./webpack.base');

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
    }
});