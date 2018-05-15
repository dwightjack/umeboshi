const {
    css, scss, resolveUrl, postcss, addCSSRule, applyLoaders, umeStyles
} = require('umeboshi-config/webpack/style-loaders');
const { paths } = require('umeboshi-dev-utils');

const PRODUCTION = process.env.NODE_ENV === 'production';

const createLoaderRule = (config, name, test, loaders = []) => {
    const baseCSSRule = addCSSRule(config, { name, test });
    const modulesCSSRule = baseCSSRule.oneOf('modules').resourceQuery(/module/);
    const normalCSSRule = baseCSSRule.oneOf('normal');

    applyLoaders(
        modulesCSSRule,
        [css({ modules: true }), postcss(), ...loaders],
        PRODUCTION,
        'vue-style-loader'
    );

    applyLoaders(
        normalCSSRule,
        [css({ modules: umeStyles.modules }), postcss(), ...loaders],
        PRODUCTION,
        'vue-style-loader'
    );

};

module.exports = (config) => {

    config.resolve.extensions
        .merge(['.js', '.vue', '.json']);

    config.module.rules.delete('css');
    createLoaderRule(config, 'css', /\.css$/);

    if (umeStyles.scss) {
        config.module.rules.delete('scss');
        createLoaderRule(config, 'scss', /\.scss$/, [resolveUrl(), scss()]);
    }

    /* eslint-disable indent */
    config.module
        .rule('vue')
            .test(/\.vue$/)
            .include
                .add(paths.toAbsPath('src.assets/js'))
                .end()
            .use('vue-loader')
                .loader('vue-loader')
                .options({
                    preserveWhitespace: false,
                    transformToRequire: {
                        video: 'src',
                        source: 'src',
                        img: 'src',
                        image: 'xlink:href'
                    }
                });
    /* eslint-enable indent */

    return config;
};