const path = require('path');
const webpack = require('webpack');
const { paths } = require('umeboshi-dev-utils');

const baseConf = require('./webpack.base')();

module.exports = (env) => {
    const config = baseConf(env);

    /* eslint-disable indent */

    config
        .cache(true)
        .entry('app')
            .add(`.${path.sep}${paths.toPath('./src.assets/styles/index.js')}`)
            .add(`.${path.sep}/${paths.toPath('./src.assets/js/app.js')}`);

    config
        .plugin('named-modules')
            .use(webpack.NamedModulesPlugin)
            .end()
        .plugin('named-chunks')
            .use(webpack.NamedChunksPlugin);
    /* eslint-enable indent */

    return config;
};