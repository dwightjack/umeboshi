const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { css, scss, resolveUrl } = require('umeboshi-config/webpack/style-loaders');
const { paths } = require('umeboshi-dev-utils');

const PRODUCTION = process.env.NODE_ENV === 'production';

const { camelCase, localIdentName } = css().options;
const vuecss = () => ({ loader: 'css-loader', options: { sourceMap: true } });

const vueLoaders = (loaders) => {
    return PRODUCTION ? ExtractTextPlugin.extract({
        fallback: 'vue-style-loader',
        use: loaders
    }) : ['vue-style-loader', ...loaders];
};

module.exports = (config) => {

    config.resolve.extensions
        .merge(['.js', '.vue', '.json']);

    /* eslint-disable indent */
    config.module
        .rule('vue')
            .test(/\.vue$/)
            .include
                .add(paths.toAbsPath('src.assets/js'))
                .end()
            .use('vue-loader')
                .loader('vue-loader')
                .options({
                    loaders: {
                        scss: vueLoaders([vuecss(), resolveUrl(), scss()]),
                        css: vueLoaders([vuecss()])
                    },
                    preserveWhitespace: false,
                    cssModules: {
                        camelCase,
                        localIdentName,
                        importLoaders: 1,
                        sourceMap: true
                    },
                    transformToRequire: {
                        video: 'src',
                        source: 'src',
                        img: 'src',
                        image: 'xlink:href'
                    }
                });
    /* eslint-enable indent */

    return config;
};