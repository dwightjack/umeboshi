const prodConfig = require('umeboshi-config/webpack/webpack.prod');
const commonConf = require('./common');

module.exports = (env) => {
    const config = prodConfig(env);
    return commonConf(config);
};