module.exports = (context, opts = {}) => {

    const isTest = process.env.BABEL_ENV === 'test' || process.env.NODE_ENV === 'test';

    const { asyncImport, async, browserslist } = Object.assign({
        async: true,
        asyncImport: true,
        browserslist: false
    }, opts);

    let presetEnv;

    if (isTest) {

        presetEnv = [
            require('babel-preset-env').default, {
                targets: {
                    node: 'current'
                }
            }
        ];

    } else {
        presetEnv = [
            require.resolve('babel-preset-env'), {
                modules: false,
                loose: true,
                useBuiltIns: 'entry',
                targets: browserslist && {
                    browsers: ['> 0.25%', 'not op_mini all', 'not ie < 11']
                }
            }
        ];
    }

    return {
        presets: [
            presetEnv,
            require.resolve('babel-preset-stage-2')
        ],

        plugins: [
            (isTest ? require.resolve('babel-plugin-transform-es2015-modules-commonjs') : null),
            (isTest ? require.resolve('babel-plugin-dynamic-import-node') : null),
            [require.resolve('babel-plugin-transform-runtime'), { polyfill: false, regenerator: (asyncImport || async) }],
            ((asyncImport || async) ? [require.resolve('babel-plugin-transform-regenerator'), { async: false }] : null)
        ].filter(Boolean)
    };

};