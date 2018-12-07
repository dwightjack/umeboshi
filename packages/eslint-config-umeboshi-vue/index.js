module.exports = {
    extends: [
        require.resolve('eslint-config-umeboshi'),
        'plugin:vue/strongly-recommended'
    ],
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 2018,
        ecmaFeatures: {
            jsx: true
        }
    },
    rules: {
        'eol-last': 0,
        'import/extensions': [
            'error',
            'always',
            {
                js: 'never',
                vue: 'never'
            }
        ],
        'vue/html-indent': ['error', 4]
    }
};
