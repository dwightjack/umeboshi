/**
 * Development Server Config
 */
const { paths } = require('umeboshi-dev-utils');
const { localhost, address } = require('umeboshi-dev-utils/lib/server');

module.exports = (env = {}, config = {}) => {

    const port = env.port || localhost.port;

    const { stats, output } = config;
    const baseUrl = `http://${address}:${port}`;
    const publicPath = baseUrl + output.publicPath;


    return {
        content: [paths.toAbsPath('dist.root')],
        hot: false,
        host: address,
        dev: {
            stats,
            port,
            publicPath,
            serverSideRender: undefined,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
            }
        }
    };
};