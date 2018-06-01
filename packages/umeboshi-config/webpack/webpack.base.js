const webpack = require('webpack');
const { webpackConfig } = require('umeboshi-dev-utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const {
    css,
    postcss,
    resolveUrl,
    scss,
    addCSSRule,
    umeStyles
} = require('./style-loaders');

module.exports = ({ paths } /*env*/) => {
    const config = webpackConfig();
    const PRODUCTION = process.env.NODE_ENV === 'production';
    const destPath = paths.toAbsPath('dist.assets');

    /* eslint-disable indent */
    config
        .target('web') // Make web variables accessible to webpack, e.g. window,
        .context(process.cwd())
        .stats({
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false,
            children: true,
            version: true,
            cached: false,
            cachedAssets: false,
            reasons: false,
            source: false,
            errorDetails: false
        })
        .devtool(PRODUCTION ? '#source-map' : '#cheap-module-source-map')
        .mode(PRODUCTION ? 'production' : 'development');

    config
        .performance
            .hints(false);

    config
        .output
            .path(destPath)
            .publicPath(paths.get('publicPath'))
            .chunkFilename(paths.get('js') + '/[name].js')
            .filename(paths.get('js') + '/[name].js');

    config
        .node
        .merge({
            fs: 'empty',
            net: 'empty',
            tls: 'empty'
        });

    config
        .resolve
            .alias
                .merge({
                    styles: paths.toAbsPath('src.assets/styles'),
                    images: paths.toAbsPath('src.assets/images'),
                    '@': paths.toAbsPath('src.assets/js')
                });

    config
        .resolve
        .modules
            .add(paths.toAbsPath('src.assets/vendors'))
            .add('node_modules');

    config
        .module
            .rule('parser')
                .parser({ amd: false });

    config.module
        .rule('js')
            .test(/\.js$/)
            .include
                .merge([
                    paths.toAbsPath('src.assets/js'),
                    paths.toAbsPath('src.assets/styles')
                ])
                .end()
            .use('babel')
                .merge({
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                });

    config.module
        .rule('html')
            .test(/\.html$/)
            .exclude
                .add(/(node_modules|vendors)/)
                .end()
            .use('raw')
                .loader('raw-loader');

    config.module
        .rule('assets')
            .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac|eot|svg|ttf|woff|woff2|jpe?g|png|gif)(\?.*)?$/)
            .include
                .merge([
                    paths.toAbsPath('src.assets/images'),
                    paths.toAbsPath('src.assets/fonts')
                ])
                .end()
            .use('file-loader')
                .merge({
                    loader: 'file-loader',
                    options: {
                        name: `[path][name]${PRODUCTION ? '.[hash:10]' : ''}.[ext]`,
                        context: paths.toPath('src.assets')
                    }
                });

    const baseStyleLoaders = [css(), postcss()];

    addCSSRule(config, {
        name: 'css',
        extract: PRODUCTION,
        test: /\.css$/,
        loaders: baseStyleLoaders
    });

    if (umeStyles.scss) {
        addCSSRule(config, {
            name: 'scss',
            extract: PRODUCTION,
            test: /\.scss$/,
            loaders: [...baseStyleLoaders, resolveUrl(), scss({
                includePaths: [
                    paths.toAbsPath('src.assets/styles'),
                    'node_modules'
                ]
            })]
        });
    }


    config.optimization
        .occurrenceOrder(true)
        .noEmitOnErrors(true)
        .runtimeChunk('single')
        .splitChunks({
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    enforce: true
                }
            }
        });

    // PLUGINS


    config
        .plugin('define')
            .use(webpack.DefinePlugin, [{
                __PRODUCTION__: PRODUCTION
            }])
            .end()
        .plugin('html')
            .use(HtmlWebpackPlugin, [{
                template: paths.toPath('src.root/templates/index.ejs'),
                filename: paths.toAbsPath('dist.root/index.html'),
                modernizr: paths.assetsPath('vendors/modernizr/modernizr.*'),
                chunksSortMode: 'dependency',
                inject: true,
                minify: (PRODUCTION ? {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: false,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true
                } : false)
            }])
            .end();

    return config;
    /* eslint-enable indent */
};