/**
 * Development Server Config
 */
const { paths } = require('umeboshi-dev-utils');
const { localhost } = require('umeboshi-dev-utils/lib/server');

module.exports = (env = {}, config = {}) => {

    const port = env.port || localhost.port;
    const { publicPath } = env;
    const { stats } = config;

    return {
        content: [paths.toAbsPath('dist.root')],
        hot: true,
        port,
        host: '0.0.0.0',
        dev: {
            stats,
            port,
            publicPath,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
            }
        }
    };
};