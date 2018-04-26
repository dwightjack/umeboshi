const rules = require('./rules');
const vueRules = require('eslint-plugin-vue/lib/configs/recommended');

module.exports = {

    extends: [
        require.resolve('eslint-config-umeboshi')
    ],

    parser: require.resolve('vue-eslint-parser'),

    parserOptions: {
        parser: require.resolve('babel-eslint'),
        ecmaFeatures: {
            jsx: false,
            experimentalObjectRestSpread: true
        }
    },

    plugins: [
        'vue'
    ],

    rules: Object.assign({}, rules, vueRules)
};