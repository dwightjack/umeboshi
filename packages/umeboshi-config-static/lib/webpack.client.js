const WebpackAssetsManifest = require('webpack-assets-manifest');

module.exports = (config) => {

    config.plugins.delete('html');

    config.plugin('assets')
        .use(WebpackAssetsManifest, [{
            writeToDisk: true,
            publicPath: true,
            sortManifest: false,
            customize(entry) {
                if (entry.key.toLowerCase().endsWith('.map')) {
                    return false;
                }
                return entry;
            },
            transform(assets) {
                return {
                    publicPath: config.output.get('publicPath'),
                    assets
                };
            }
        }]);

    return config;
};