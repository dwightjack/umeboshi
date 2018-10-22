module.exports = (config) => {
    const jest = require('./jest.config');
    const customizr = require('./modernizr/prod');
    const vueWebpackConfig = require('./webpack/common');
    config
        .tap('jest', jest)
        .tap('webpack', vueWebpackConfig)
        .tap('customizr', customizr);
};
