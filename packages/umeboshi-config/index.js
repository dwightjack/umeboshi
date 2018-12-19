const paths = require('./paths');
const hosts = require('./hosts');
const jest = require('./jest.config');
const customizr = require('./modernizr/prod');
const modernizr = require('./modernizr/dev');
const devServer = require('./server/dev');
const HtmlModuleScriptWebpackPlugin = require('./webpack/html-plugin');

let modernBuildHTMLPlugin;

const factoryHTMLPlugin = () => {
    if (!modernBuildHTMLPlugin) {
        modernBuildHTMLPlugin = new HtmlModuleScriptWebpackPlugin({
            matchModule: /\.module\./
        });
    }
    return modernBuildHTMLPlugin;
};

module.exports = (config, { modernBuild = false }) => {
    config.tap('env', (env) => {
        return Object.assign(env, {
            modernBuild
        });
    });

    config.merge({
        hosts,
        paths,
        jest,
        modernizr,
        customizr,
        devServer
    });

    config.set('webpack', require('./webpack'));

    if (modernBuild) {
        config.tap('webpack', (webpackConfig) => {
            if (
                webpackConfig.target('web') &&
                webpackConfig.plugins.has('html')
            ) {
                webpackConfig
                    .plugin('html-multi')
                    .after('html-prefetch')
                    .use(HtmlModuleScriptWebpackPlugin)
                    .init(factoryHTMLPlugin);
            }
        });
    }
};
