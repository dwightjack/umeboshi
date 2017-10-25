const airbnb = [
    'eslint-config-airbnb-base/rules/best-practices',
    'eslint-config-airbnb-base/rules/errors',
    'eslint-config-airbnb-base/rules/node',
    'eslint-config-airbnb-base/rules/style',
    'eslint-config-airbnb-base/rules/variables',
    'eslint-config-airbnb-base/rules/es6'
].map(require.resolve);

module.exports = {

    plugins: ['node'],

    env: {
        node: true,
        es6: true
    },

    extends: [
        'eslint:recommended',
        'plugin:node/recommended'
    ].concat(airbnb),

    rules: {
        indent: ['error', 4],
        'consistent-return': 'error',
        'arrow-body-style': 'off',
        'no-multiple-empty-lines': ['warn', { max: 3 }],
        'comma-dangle': ['error', 'never'],
        'padded-blocks': 'off',
        'arrow-parens': ['error', 'always'],
        'spaced-comment': 'off',
        'object-curly-spacing': ['error', 'always'],
        'global-require': 'off',
        'eol-last': ['warn', 'never'],
        'max-len': 'off',
        'prefer-template': 'off',
        'function-paren-newline': 'off'
    }
};