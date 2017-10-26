const config = require('umeboshi-config/jest.config');

module.exports = Object.assign(config, {
    moduleFileExtensions: ['js', 'json', 'vue'],
    transform: {
        '^.+\\.js$': 'babel-jest',
        '.*\\.(vue)$': 'jest-vue-preprocessor'
    }
});