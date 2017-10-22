const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { loadConfig } = require('umeboshi-dev-utils');

const paths = loadConfig('paths.js');

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

const sass = {
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

const loaders = [
    css,
    postcss,
    resolveUrl,
    sass
];

module.exports = {

    loaders: (PRODUCTION ? ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: loaders
    }) : ['style-loader', ...loaders]),

    css,
    postcss,
    resolveUrl,
    sass
};