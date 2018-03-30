const config = require('umeboshi-config/webpack/webpack.base');
const { loadConfig, paths } = require('umeboshi-dev-utils');

const { vueLoaders, css } = loadConfig('webpack/style-loaders.js');
const { localIdentName, camelCase } = css.options;
const { rules } = config.module;

module.exports = Object.assign({}, config, {

    module: {
        rules: [
            ...rules,
            {
                test: /\.vue$/,
                include: [
                    paths.toAbsPath('src.assets/js')
                ],
                loader: 'vue-loader',
                options: {
                    loaders: vueLoaders,
                    preserveWhitespace: false,
                    cssModules: {
                        camelCase,
                        localIdentName,
                        importLoaders: 1,
                        sourceMap: true
                    },
                    transformToRequire: {
                        video: 'src',
                        source: 'src',
                        img: 'src',
                        image: 'xlink:href'
                    }
                }
            }
        ]
    },

    resolve: Object.assign({
        extensions: ['.js', '.vue', '.json']
    }, config.resolve)

});