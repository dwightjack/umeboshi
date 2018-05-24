const config = require('umeboshi-config/webpack/webpack.prod');
const commonConf = require('./common');

module.exports = (env) => commonConf(config(env));