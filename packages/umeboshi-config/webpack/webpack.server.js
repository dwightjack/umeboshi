/**
 * Development Server Config
 */
const { paths } = require('umeboshi-dev-utils');
const { localhost, address } = require('umeboshi-dev-utils/lib/server');

module.exports = (env = {}, config) => {

    const port = env.port || localhost.port;

    const baseUrl = `http://${address}:${port}`;
    const publicPath = baseUrl + paths.get('publicPath');


    config.entry('app')
        .prepend('eventsource-polyfill')
        .prepend(`webpack-dev-server/client?${baseUrl}`);

    config.output
        .publicPath(publicPath);

    config.devServer
        .public(address)
        .contentBase(paths.toAbsPath('dist.root'))
        .compress(false)
        .hot(false)
        .historyApiFallback(true)
        .publicPath(publicPath)
        .headers({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
        });
    return config;
};