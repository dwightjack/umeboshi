const config = require('umeboshi-config/jest.config');
const merge = require('lodash.merge');

module.exports = merge(config, {
    moduleFileExtensions: ['js', 'json', 'vue'],
    setupFiles: [require.resolve('./lib/jest.setup')],
    moduleNameMapper: Object.assign(
        {
            '^vue$': 'vue/dist/vue.min.js'
        },
        config.moduleNameMapper
    ),
    transformIgnorePatterns: ['/node_modules/(?!gsap/)'],
    transform: {
        '^.+\\.js$': 'babel-jest',
        '.*\\.(vue)$': 'vue-jest'
    },
    globals: {
        'vue-jest': {
            experimentalCSSCompile: false
        }
    }
});
