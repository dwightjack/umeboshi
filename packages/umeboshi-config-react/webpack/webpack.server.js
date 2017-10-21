const webpack = require('webpack');
const config = require('umeboshi-config/webpack/webpack.server');

const app = [
    'eventsource-polyfill', // Necessary for hot reloading with IE
    'react-hot-loader/patch',
    ...config.entry.app.slice(1),
    'webpack/hot/only-dev-server'
];

module.exports = Object.assign({}, config, {
    entry: {
        app
    },

    plugins: (config.plugins || []).concat([
        new webpack.HotModuleReplacementPlugin()
    ]),

    devServer: Object.assign({}, config.devServer, { hot: true })
});