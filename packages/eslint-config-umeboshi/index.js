let webpackConfPath;

try {
    webpackConfPath = require.resolve('umeboshi-scripts/webpack');
} catch (e) {
    console.warn('Skipping webpack configuration resolver'); //eslint-disable-line no-console
}

module.exports = {
    parser: 'babel-eslint',

    extends: ['eslint-config-airbnb-base'],

    env: {
        es6: true,
        browser: true
    },

    parserOptions: {
        ecmaVersion: 2018
    },

    settings: webpackConfPath
        ? {
              'import/resolver': {
                  webpack: {
                      config: webpackConfPath
                  }
              }
          }
        : {},

    globals: {
        Modernizr: true,
        __PRODUCTION__: true
    },

    rules: {
        indent: [2, 2],
        'no-multiple-empty-lines': [2, { max: 3 }],
        'spaced-comment': 0,
        'comma-dangle': [2, 'never'],
        'eol-last': [1, 'never'],
        'padded-blocks': [1, { classes: 'always' }],
        'max-len': 0,
        'no-underscore-dangle': 0,
        'arrow-parens': [1, 'always'],
        'arrow-body-style': 0,
        'import/no-unresolved': [2, { ignore: ['[a-z]+.s?css$'] }]
    }
};
