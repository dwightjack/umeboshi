const presetEnv = require('babel-preset-env');
const presetStage2 = require('babel-preset-stage-2');
const transformRuntime = require('babel-plugin-transform-runtime');

const isTest = process.env.BABEL_ENV === 'test' || process.env.NODE_ENV === 'test';

module.exports = {
    presets: [
        [presetEnv, {
            modules: false,
            loose: true,
            useBuiltIns: 'entry',
            targets: {
                browsers: ['> 1%', 'last 2 versions', 'not ie < 11']
            }
        }],
        presetStage2
    ],

    plugins: [
        (isTest ? require('babel-plugin-transform-es2015-modules-commonjs') : null),
        [transformRuntime, { polyfill: false, regenerator: false }]
    ].filter(Boolean)
};