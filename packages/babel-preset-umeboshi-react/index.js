const presetReact = require.resolve('@babel/preset-react');

module.exports = (api) => {
    api.assertVersion(7);

    const IS_PRODUCTION = api.env('production');

    return {
        presets: [presetReact],

        plugins: IS_PRODUCTION
            ? [
                  [
                      require.resolve(
                          'babel-plugin-transform-react-remove-prop-types'
                      ),
                      {
                          removeImport: true
                      }
                  ]
              ]
            : ['react-hot-loader/babel']
    };
};
