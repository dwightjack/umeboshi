const path = require('path');
const webpack = require('webpack');
const { paths, APP_PATH, webpackConfig } = require('umeboshi-dev-utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const {
    css,
    postcss,
    resolveUrl,
    scss,
    addCSSRule
} = require('./style-loaders');

const PRODUCTION = process.env.NODE_ENV === 'production';
const destPath = paths.toAbsPath('dist.assets');



module.exports = (/*env*/) => {
    const config = webpackConfig();

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
        .devtool(PRODUCTION ? '#source-map' : '#cheap-module-source-map');

    config
        .performance
            .hints(false);

    config
        .output
            .path(destPath)
            .publicPath(paths.get('publicPath'))
            .chunkFilename(paths.get('js') + '/[name].chunk.js')
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
        .rule('json')
            .test(/\.json$/)
            .exclude
                .add(/(node_modules|vendors)/)
                .end()
            .use('json')
                .loader('json-loader');

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

    addCSSRule(config, {
        name: 'styles',
        extract: PRODUCTION,
        test: /\.(scss|css)$/,
        loaders: [css, postcss, resolveUrl, scss]
    });

    // PLUGINS

    config
        .plugin('error')
            .use(webpack.NoEmitOnErrorsPlugin).end()
        .plugin('define')
            .use(webpack.DefinePlugin, [{
                __PRODUCTION__: PRODUCTION,
                'process.env': {
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
                }
            }])
            .end()
        // @see https://github.com/vuejs-templates/webpack/blob/master/template/build/webpack.prod.conf.js#L67
        .plugin('vendors-chunk')
            .use(webpack.optimize.CommonsChunkPlugin, [{
                name: 'vendors',
                minChunks(module) {
                    // any required modules inside node_modules are extracted to vendor
                    return (
                        module.resource &&
                        /\.js$/.test(module.resource) &&
                        module.resource.indexOf(
                            path.join(APP_PATH, 'node_modules')
                        ) === 0
                    );
                }
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