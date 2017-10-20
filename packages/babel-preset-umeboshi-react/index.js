const presetUmeboshi = require('babel-preset-umeboshi');
const presetReact = require('babel-preset-react');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    presets: [
        presetUmeboshi,
        presetReact
    ],

    plugins: isProduction ? [
        require('babel-plugin-transform-react-constant-elements'),
        require('babel-plugin-transform-react-inline-elements'),
        require('babel-plugin-transform-react-remove-prop-types')
    ] : []
};