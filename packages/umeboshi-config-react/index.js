module.exports = (config) => {
    const jest = require('./jest.config');

    config.tap('jest', jest).tap('webpack', (webpackConfig) => {
        webpackConfig.resolve.extensions.merge(['.js', '.jsx', '.json']);

        webpackConfig.module.rule('js').test(/\.jsx?$/);
    });
};
