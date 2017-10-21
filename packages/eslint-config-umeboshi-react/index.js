const eslintConfig = require('eslint-config-umeboshi');

module.exports = Object.assign({}, eslintConfig, {
    extends: ['airbnb'],

    plugins: [
        'react'
    ],

    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
            jsx: true
        }
    },

    rules: Object.assign({
        'import/extensions': 0,
        'react/require-default-props': 0,
        'react/jsx-indent': [2, 4],
        'react/jsx-indent-props': [2, 4],
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
        'react/prefer-stateless-function': 0,
        'jsx-a11y/html-has-lang': 0
    }, eslintConfig.rules)
});