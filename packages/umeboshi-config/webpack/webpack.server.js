/**
 * Development Server Config
 */
const { paths } = require('umeboshi-dev-utils');
const { localhost, address } = require('umeboshi-dev-utils/lib/server');

const publicPath = `http://${address}:${localhost.port}${paths.get('publicPath')}`;

module.exports = {
    entry: {
        app: [
            'eventsource-polyfill',
            'webpack-dev-server/client?http://' + address + ':' + localhost.port
        ]
    },
    output: {
        publicPath
    },
    devServer: {
        public: address,
        contentBase: paths.toAbsPath('dist.root'),
        compress: false,
        hot: false,
        historyApiFallback: true,
        //TODO: temporary fix for https://github.com/mxstbr/react-boilerplate/issues/370 and https://github.com/webpack/style-loader/pull/96
        publicPath,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
        }
    }
};