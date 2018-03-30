const ExtractTextPlugin = require('extract-text-webpack-plugin');

const { paths } = require('umeboshi-dev-utils');

const PRODUCTION = process.env.NODE_ENV === 'production';

const css = {
    loader: 'css-loader',
    options: {
        modules: true,
        camelCase: true,
        importLoaders: 1,
        sourceMap: true,
        localIdentName: '[name]__[local]---[hash:base64:5]'
    }
};

const postcss = { loader: 'postcss-loader', options: { sourceMap: true } };

const resolveUrl = { loader: 'resolve-url-loader', options: { sourceMap: true } };

const scss = {
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
};

const createExtractLoader = (config = {}, loaders = [], fallback = 'style-loader') => {

    return () => {
        const use = (PRODUCTION ? ExtractTextPlugin.extract({
            fallback,
            use: loaders
        }) : [fallback, ...loaders]);

        return Object.assign({ use }, config);
    };

};

module.exports = {
    createExtractLoader,
    css,
    postcss,
    resolveUrl,
    scss
};