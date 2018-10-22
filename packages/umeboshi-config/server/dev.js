/**
 * Development Server Config
 */
module.exports = ({ paths, hosts }) => (env = {}, webpackConfig = {}) => {
    const { localhost = {} } = hosts;
    const port = env.port || localhost.port;
    const { publicPath } = env;
    const { stats } = webpackConfig;

    return {
        content: [paths.toAbsPath('dist.root')],
        hot: true,
        port,
        host: '0.0.0.0',
        logLevel: 'warn',
        dev: {
            stats,
            port,
            publicPath,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods':
                    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Access-Control-Allow-Headers':
                    'X-Requested-With, content-type, Authorization'
            }
        }
    };
};
