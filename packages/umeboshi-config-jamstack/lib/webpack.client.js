module.exports = (config, { paths }) => {

    const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

    config.plugin('html')
        .tap(([options]) => [
            Object.assign(options, {
                alwaysWriteToDisk: true,
                filename: paths.toAbsPath('tmp/templates/default.ejs'),
                template: paths.toPath('src.root/templates/default.ejs')
            })
        ]);
    config.plugin('html-disk')
        .use(HtmlWebpackHarddiskPlugin);
};