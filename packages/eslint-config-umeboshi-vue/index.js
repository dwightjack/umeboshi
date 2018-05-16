const rules = require('./rules');

module.exports = {
    extends: [
        require.resolve('eslint-config-umeboshi'),
        'plugin:vue/strongly-recommended'
    ],
    parserOptions: {
        parser: 'babel-eslint',
        ecmaFeatures: {
            jsx: false,
            experimentalObjectRestSpread: true
        }
    },
    rules
};