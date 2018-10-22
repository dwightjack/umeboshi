/**
 * Development Server Config
 */
module.exports = ({ paths, hosts }) => (env = {}, webpackConfig = {}) => {
    const { localhost = {} } = hosts;
    const port = env.port || localhost.port;
    const { publicPath } = env;
    const { stats } = webpackConfig;

    return {
        contentBase: [paths.toAbsPath('dist.root')],
        hot: true,
        hotOnly: false,
        port,
        host: '0.0.0.0',
        stats,
        clientLogLevel: 'warning',
        publicPath,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods':
                'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers':
                'X-Requested-With, content-type, Authorization'
        }
    };
};
