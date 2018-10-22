module.exports = (context, opts = {}) => {
    const IS_TEST =
        process.env.BABEL_ENV === 'test' || process.env.NODE_ENV === 'test';

    const IS_NODE = IS_TEST || process.env.TARGET_ENV === 'node';

    const { asyncImport, async, targets } = Object.assign(
        {
            async: true,
            asyncImport: true
        },
        opts
    );

    let presetEnv;

    if (IS_NODE) {
        presetEnv = [
            require.resolve('@babel/preset-env'),
            {
                targets: {
                    node: 'current'
                }
            }
        ];
    } else {
        presetEnv = [
            require.resolve('@babel/preset-env'),
            {
                modules: false,
                loose: true,
                useBuiltIns: 'usage',
                targets
            }
        ];
    }

    return {
        presets: [presetEnv],

        plugins: [
            IS_NODE &&
                require.resolve('@babel/plugin-transform-modules-commonjs'),
            IS_NODE
                ? require.resolve('babel-plugin-dynamic-import-node')
                : require.resolve('@babel/plugin-syntax-dynamic-import'),
            require.resolve('@babel/plugin-proposal-class-properties'),
            require.resolve('@babel/plugin-proposal-object-rest-spread'),
            require.resolve('@babel/plugin-transform-runtime'),
            asyncImport || async
                ? [
                      require.resolve('@babel/plugin-transform-regenerator'),
                      { async }
                  ]
                : null
        ].filter(Boolean)
    };
};
