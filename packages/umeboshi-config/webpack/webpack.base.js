const path = require('path');
const { webpackConfig } = require('umeboshi-dev-utils');

const {
    css,
    postcss,
    resolveUrl,
    scss,
    addCSSRule,
    umeStyles
} = require('./style-loaders');

module.exports = ({ paths }, env) => {
    const { target, production: PRODUCTION } = env;

    const webpack = require('webpack');
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    const config = webpackConfig();
    const IS_MODERN = target === 'modern';
    const destPath = paths.toAbsPath('dist.assets');

    /* eslint-disable indent */
    config
        .set('name', `client:${IS_MODERN ? 'modern' : 'legacy'}`)
        .target('web') // Make web variables accessible to webpack, e.g. window,
        .context(process.cwd())
        .devtool(PRODUCTION ? '#source-map' : '#cheap-module-source-map')
        .mode(PRODUCTION ? 'production' : 'development');

    config.performance.hints(false);

    config.output
        .path(destPath)
        .publicPath(paths.get('publicPath'))
        .chunkFilename(paths.get('js') + '/[name].js')
        .filename(
            `${paths.get('js')}/[name].${IS_MODERN ? 'module' : 'bundle'}.js`
        );

    config.node.merge({
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    });

    config.resolve.alias.merge({
        styles: paths.toAbsPath('src.assets/styles'),
        images: paths.toAbsPath('src.assets/images'),
        '@': paths.toAbsPath('src.assets/js')
    });

    config.resolve.modules
        .add(paths.toAbsPath('src.assets/vendors'))
        .add('node_modules');

    config.module.rule('parser').parser({ amd: false });

    config.module
        .rule('js')
        .test(/\.js$/)
        .include.merge([
            paths.toAbsPath('src.assets/js'),
            paths.toAbsPath('src.assets/styles')
        ])
        .end()
        .use('babel')
        .merge({
            loader: path.join(__dirname, 'babel-loader.js'),
            options: {
                modern: IS_MODERN,
                cacheDirectory: true
            }
        });

    config.module
        .rule('html')
        .test(/\.html$/)
        .exclude.add(/(node_modules|vendors)/)
        .end()
        .use('raw')
        .loader('raw-loader');

    config.module
        .rule('assets')
        .test(
            /\.(mp4|webm|ogg|mp3|wav|flac|aac|eot|svg|ttf|woff|woff2|jpe?g|png|gif)(\?.*)?$/
        )
        .include.merge([
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
            loaders: [
                ...baseStyleLoaders,
                resolveUrl(),
                scss({
                    includePaths: [
                        paths.toAbsPath('src.assets/styles'),
                        'node_modules'
                    ]
                })
            ]
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
        .use(webpack.DefinePlugin, [
            {
                __PRODUCTION__: PRODUCTION
            }
        ])
        .end()
        .plugin('html')
        .use(HtmlWebpackPlugin, [
            {
                template: paths.toPath('src.root/templates/index.ejs'),
                filename: paths.toAbsPath('dist.root/index.html'),
                modernizr: paths.assetsPath('vendors/modernizr/modernizr.*'),
                chunksSortMode: 'dependency'
            }
        ])
        .end();

    return config;
    /* eslint-enable indent */
};
