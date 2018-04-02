const $loaders = require('umeboshi-config/webpack/loaders');
const { paths } = require('umeboshi-dev-utils');

const {
    css, scss, resolveUrl, createExtractLoader
} = require('umeboshi-config/webpack/style-loaders');

const { camelCase, localIdentName } = css.options;
const vuecss = { loader: 'css-loader', options: { sourceMap: true } };

$loaders.set('vue', {
    test: /\.vue$/,
    include: [
        paths.toAbsPath('src.assets/js')
    ],
    loader: 'vue-loader',
    options: {
        loaders: {
            scss: createExtractLoader({}, [vuecss, resolveUrl, scss], 'vue-style-loader')().use,
            css: createExtractLoader({}, [vuecss], 'vue-style-loader')().use
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
    }
});

module.exports = $loaders;