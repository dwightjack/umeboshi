module.exports = (config, { paths }, { server }) => {
    const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

    config.cache(!!server);

    config.plugin('html').tap(([options]) => [
        Object.assign(options, {
            minify: false,
            alwaysWriteToDisk: true,
            filename: paths.toAbsPath('tmp/templates/default.ejs'),
            template: paths.toPath('src.root/templates/default.ejs')
        })
    ]);

    config
        .plugin('html-disk')
        .after('html')
        .use(HtmlWebpackHarddiskPlugin);
};
