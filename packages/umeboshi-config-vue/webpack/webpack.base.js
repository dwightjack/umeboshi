const config = require('umeboshi-config/webpack/webpack.base');
const { loadConfig } = require('umeboshi-dev-utils');

const paths = loadConfig('paths.js');
const { vueLoaders, css } = loadConfig('webpack/style-loaders.js');
const { localIdentName, camelCase } = css.options;

module.exports = Object.assign({}, config, {

    rules: config.rules.concat([
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
    ]),

    resolve: Object.assign({
        extensions: ['.js', '.vue', '.json']
    }, config.resolve)

});