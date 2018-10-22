const presetUmeboshi = require.resolve('babel-preset-umeboshi');
const presetReact = require.resolve('@babel/preset-react');

module.exports = () => {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
        presets: [presetUmeboshi, presetReact],

        plugins: isProduction
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
