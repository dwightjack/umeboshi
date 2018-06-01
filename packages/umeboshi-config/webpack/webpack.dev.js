const path = require('path');
const webpack = require('webpack');

module.exports = (api, env) => {
    const config = require('./webpack.base')(api, env);
    const { paths } = api;

    /* eslint-disable indent */

    config
        .cache(true)
        .entry('app')
            .add(`.${path.sep}${paths.toPath('./src.assets/styles/index.js')}`)
            .add(`.${path.sep}${paths.toPath('./src.assets/js/app.js')}`);

    config
        .plugin('named-chunks')
            .use(webpack.NamedChunksPlugin);
    /* eslint-enable indent */

    return config;
};