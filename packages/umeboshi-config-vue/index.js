const jest = require('./jest.config');
const customizr = require('./modernizr/prod');
const { webpack } = require('umeboshi-config');
const vueWebpackConfig = require('./webpack/common');

module.exports = {
    extends: {
        'umeboshi-config': {}
    },
    customizr,
    jest,
    webpack(env) {
        return vueWebpackConfig(webpack(env));
    }
};