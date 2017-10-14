module.exports = {
    env: {
        browser: false,
        es6: true
    },
    extends: ['eslint-config-airbnb-base'],

    rules: {
        indent: [2, 4],
        'no-multiple-empty-lines': [2, { max: 3 }],
        'spaced-comment': 0,
        'comma-dangle': [2, 'never'],
        'eol-last': [1, 'never'],
        'padded-blocks': [1, { classes: 'always' }],
        'max-len': 0,
        'arrow-parens': 0,
        'global-require': 0,
        'no-commonjs': 0,
        'arrow-body-style': 0,
        'prefer-template': 0,

        'import/no-dynamic-require': 0,
        'import/no-unresolved': [2, { commonjs: true }],
        'import/no-extraneous-dependencies': [2, { devDependencies: true, optionalDependencies: true, peerDependencies: true }]
    }
};