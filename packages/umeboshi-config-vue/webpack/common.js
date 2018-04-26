const {
    css, scss, resolveUrl, createExtractLoader
} = require('umeboshi-config/webpack/style-loaders');
const { paths } = require('umeboshi-dev-utils');

const { camelCase, localIdentName } = css().options;
const vuecss = () => ({ loader: 'css-loader', options: { sourceMap: true } });

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
                        scss: createExtractLoader([vuecss(), resolveUrl(), scss()], 'vue-style-loader'),
                        css: createExtractLoader([vuecss()], 'vue-style-loader')
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