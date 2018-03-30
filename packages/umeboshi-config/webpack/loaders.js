const path = require('path');
const { loaderMap } = require('umeboshi-dev-utils/lib/maps');
const { paths } = require('umeboshi-dev-utils');
const {
    css,
    postcss,
    resolveUrl,
    scss,
    createExtractLoader
} = require('./style-loaders');

const PRODUCTION = process.env.NODE_ENV === 'production';
const srcPath = paths.toAbsPath('src.assets');

const $map = loaderMap();

$map
    .set('js', {
        test: /\.js$/,
        include: [path.join(srcPath, paths.js), path.join(srcPath, paths.styles)],
        loader: 'babel-loader',
        options: {
            cacheDirectory: true
        }
    })
    .set('html', {
        test: /\.html$/,
        exclude: /(node_modules|vendors)/,
        loader: 'raw-loader'
    })
    .set('json', {
        test: /\.json$/,
        exclude: /(node_modules|vendors)/,
        loader: 'json-loader'
    })
    .set('styles', createExtractLoader({
        test: /\.(scss|css)$/,
        exclude: /(node_modules|vendors)/
    }, [css, postcss, resolveUrl, scss])
    )
    .set('files', {
        test: /\.(eot|svg|ttf|woff|woff2|jpe?g|png|gif)$/,
        include: [
            paths.toAbsPath('src.assets/images'),
            paths.toAbsPath('src.assets/fonts')
        ],
        loader: 'file-loader',
        options: {
            name: (PRODUCTION ? '[path][name].[hash:10].[ext]' : '[path][name].[ext]'),
            context: paths.toPath('src.assets')
        }
    });

module.exports = $map;