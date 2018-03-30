const merge = require('webpack-merge');
const path = require('path');
const { paths } = require('umeboshi-dev-utils');

const webpackConf = require('./webpack.base');

module.exports = merge.smart(webpackConf, {
    entry: {
        app: [
            `.${path.sep}${paths.toPath('./src.assets/styles/index.js')}`,
            `.${path.sep}/${paths.toPath('./src.assets/js/app.js')}`
        ]
    },

    cache: true
});