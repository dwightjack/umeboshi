const { paths } = require('umeboshi-dev-utils');

const css = () => ({
    loader: 'css-loader',
    options: {
        modules: true,
        camelCase: true,
        importLoaders: 1,
        sourceMap: true,
        localIdentName: '[name]__[local]---[hash:base64:5]'
    }
});

const postcss = () => ({ loader: 'postcss-loader', options: { sourceMap: true } });

const resolveUrl = () => ({ loader: 'resolve-url-loader', options: { sourceMap: true } });

const scss = () => ({
    loader: 'sass-loader',
    options: {
        sourceMap: true,
        precision: 10,
        includePaths: [
            paths.toAbsPath('src.assets/styles'),
            'node_modules'
        ],
        outputStyle: 'expanded'
    }
});
/* eslint-disable indent */
const addCSSRule = (config, {
    test, loaders, name, extract = false
}) => {

    const rule = config.module
        .rule(name)
            .test(test)
            .exclude
                .add(/(node_modules|vendors)/)
                .end();

    if (extract) {
        rule.use('extract-css-loader').merge({
            loader: 'extract-text-webpack-plugin/loader', options: { omit: 1, remove: true }
        });
    }
    rule.use('style-loader').loader('style-loader');

    loaders.forEach((factory) => {
        const { loader, options } = factory(config);
        rule.use(loader).loader(loader).options(options);
    });

};
/* eslint-enable indent */

module.exports = {
    addCSSRule,
    css,
    postcss,
    resolveUrl,
    scss
};