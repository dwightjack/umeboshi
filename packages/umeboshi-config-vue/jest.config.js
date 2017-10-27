const config = require('umeboshi-config/jest.config');

module.exports = Object.assign(config, {
    moduleFileExtensions: ['js', 'json', 'vue'],
    setupFiles: [require.resolve('./lib/jest.setup')],
    moduleNameMapper: {
        '^vue$': 'vue/dist/vue.min.js'
    },
    transform: {
        '^.+\\.js$': 'babel-jest',
        '.*\\.(vue)$': 'vue-jest'
    }
});