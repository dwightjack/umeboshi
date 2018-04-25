const { paths } = require('umeboshi-dev-utils');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PRODUCTION = process.env.NODE_ENV === 'production';

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

    const fallback = 'style-loader';
    if (extract) {
        const [extractLoader] = ExtractTextPlugin.extract({ fallback });
        rule.use('extract-css-loader').merge(extractLoader);
    }
    rule.use(fallback).loader(fallback);

    loaders.forEach((factory) => {
        const { loader, options = {} } = factory(config);
        rule.use(loader).loader(loader).options(options);
    });

};
/* eslint-enable indent */

const createExtractLoader = (loaders = [], fallback = 'style-loader') => {

    return (PRODUCTION ? ExtractTextPlugin.extract({
            fallback,
            use: loaders
        }) : [fallback, ...loaders]);
};

module.exports = {
    addCSSRule,
    createExtractLoader,
    css,
    postcss,
    resolveUrl,
    scss
};