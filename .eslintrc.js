const airbnb = [
    'eslint-config-airbnb-base/rules/best-practices',
    'eslint-config-airbnb-base/rules/errors',
    'eslint-config-airbnb-base/rules/node',
    'eslint-config-airbnb-base/rules/style',
    'eslint-config-airbnb-base/rules/variables',
    'eslint-config-airbnb-base/rules/es6'
].map(require.resolve);

module.exports = {
    root: true,

    plugins: ['node', 'prettier'],

    env: {
        node: true,
        es6: true
    },

    extends: ['eslint:recommended', 'plugin:node/recommended'].concat(),

    parserOptions: {
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
    },

    overrides: [
        {
            files: ['*.test.js'],
            env: {
                jest: true
            }
        }
    ]
};
