const devConfig = require('umeboshi-config/webpack/webpack.dev');
const commonConf = require('./common');

module.exports = (env) => {
    const config = devConfig(env);
    return commonConf(config);
};