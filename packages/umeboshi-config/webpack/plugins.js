const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { APP_PATH, paths } = require('umeboshi-dev-utils');
const { pluginMap } = require('umeboshi-dev-utils/lib/maps');

const PRODUCTION = process.env.NODE_ENV === 'production';

const $map = pluginMap();

$map
    .set('error', {
        plugin: webpack.NoEmitOnErrorsPlugin
    })
    .set('define', {
        plugin: webpack.DefinePlugin,
        options: {
            __PRODUCTION__: PRODUCTION,
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }
    })
    .set('vendorsChunk', {
        // @see https://github.com/vuejs-templates/webpack/blob/master/template/build/webpack.prod.conf.js#L67
        plugin: webpack.optimize.CommonsChunkPlugin,
        options: {
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
        }
    })
    .set('html', {
        plugin: HtmlWebpackPlugin,
        options: {
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
        }
    });

if (!PRODUCTION) {

    $map
        .set('namedNodules', {
            plugin: webpack.NamedModulesPlugin
        })
        .set('namedChunks', {
            plugin: webpack.NamedChunksPlugin
        });

} else {

    $map
        .set('hashedModules', {
            plugin: webpack.HashedModuleIdsPlugin
        })
        .set('uglify', {
            plugin: webpack.optimize.UglifyJsPlugin,
            options: {
                sourceMap: true,
                compressor: {
                    warnings: false
                }
            }
        })
        .set('loaderOptions', {
            plugin: webpack.LoaderOptionsPlugin,
            options: { minimize: true }
        })
        .set('extractStyles', {
            plugin: ExtractTextPlugin,
            options: {
                allChunks: true,
                filename: paths.toPath('styles/[name].[contenthash:10].css')
            }
        })
        .set('manifestChunk', {
            plugin: webpack.optimize.CommonsChunkPlugin,
            options: {
                name: 'manifest',
                chunks: ['vendors']
            }
        });
}


module.exports = $map;