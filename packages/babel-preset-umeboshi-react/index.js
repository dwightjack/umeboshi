const presetUmeboshi = require.resolve('babel-preset-umeboshi');
const presetReact = require.resolve('babel-preset-react');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    presets: [
        presetUmeboshi,
        presetReact
    ],

    plugins: isProduction ? [
        require.resolve('babel-plugin-transform-react-constant-elements'),
        require.resolve('babel-plugin-transform-react-inline-elements'),
        require.resolve('babel-plugin-transform-react-remove-prop-types')
    ] : []
};