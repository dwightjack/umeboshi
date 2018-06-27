const { loadUmeboshiConfig } = require('umeboshi-dev-utils');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const umeStyles = Object.assign({
    modules: true,
    sourceMap: true,
    scss: true
}, loadUmeboshiConfig('styles'));
const { modules, sourceMap } = umeStyles;

const createStyleLoader = (loader, defs = {}) => (options) => ({
    loader,
    options: Object.assign({}, defs, options)
});

const applyLoaders = (rule, loaders = [], extract = false, styleLoader = 'style-loader') => {
    if (extract) {
        rule.use(styleLoader).loader(MiniCssExtractPlugin.loader);
    } else {
        rule.use(styleLoader).loader(styleLoader).options({ sourceMap });
    }
    loaders.forEach(({ loader, options }) => {
        rule.use(loader).loader(loader).options(options);
    });
};


/* eslint-disable indent */
const addCSSRule = (config, {
    test, loaders = [], name, extract = false, styleLoader = 'style-loader'
}) => {

    const rule = config.module
        .rule(name)
            .test(test)
            .exclude
                .add(/(node_modules|vendors)/)
                .end();

    if (!loaders || loaders.length === 0) {
        return rule;
    }


    applyLoaders(rule, loaders, extract, styleLoader);

    return rule;

};
/* eslint-enable indent */

const css = createStyleLoader('css-loader', {
    modules,
    camelCase: true,
    importLoaders: 1,
    sourceMap,
    localIdentName: '[name]__[local]---[hash:base64:5]'
});

const postcss = createStyleLoader('postcss-loader', { sourceMap });
const resolveUrl = createStyleLoader('resolve-url-loader', { sourceMap });

const scss = createStyleLoader('sass-loader', {
    sourceMap,
    precision: 10,
    includePaths: [
        //paths.toAbsPath('src.assets/styles'),
        'node_modules'
    ],
    outputStyle: 'expanded'
});


module.exports = {
    createStyleLoader,
    addCSSRule,
    applyLoaders,
    css,
    postcss,
    resolveUrl,
    scss,
    umeStyles
};