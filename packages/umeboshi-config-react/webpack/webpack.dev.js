const config = require('umeboshi-config/webpack/webpack.dev');
const commonConf = require('./common');

module.exports = (env) => commonConf(config(env));