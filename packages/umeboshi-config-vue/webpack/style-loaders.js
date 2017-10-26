const {
    css, scss, postcss, resolveUrl, createLoader
} = require('umeboshi-config/webpack/style-loaders');

const vuecss = { loader: 'css-loader', options: { sourceMap: true } };

const vueLoaders = {
    scss: createLoader([vuecss, resolveUrl, scss], 'vue-style-loader'),
    css: createLoader([vuecss], 'vue-style-loader')
};

module.exports = {
    createLoader,
    vueLoaders,
    css,
    postcss,
    resolveUrl,
    scss
};