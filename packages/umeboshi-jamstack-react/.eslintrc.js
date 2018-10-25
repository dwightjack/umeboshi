module.exports = {
    root: true,

    extends: [
        'eslint:recommended',
        'eslint-config-airbnb-base',
        'plugin:prettier/recommended'
    ],
    env: {
        es6: true,
        browser: true
    },
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2018
    },
    rules: {
        'consistent-return': 'error',
        'arrow-body-style': 'off',
        'no-multiple-empty-lines': ['warn', { max: 3 }],
        'comma-dangle': ['error', 'never'],
        'padded-blocks': 'off',
        'arrow-parens': ['error', 'always'],
        'spaced-comment': 'off',
        'object-curly-spacing': ['error', 'always'],
        'global-require': 'off',
        'prefer-template': 'off',
        'function-paren-newline': 'off',
        'prettier/prettier': ['error']
    }
};
