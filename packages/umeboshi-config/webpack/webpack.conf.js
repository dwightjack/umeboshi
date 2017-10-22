const { loadConfig } = require('umeboshi-dev-utils');

const PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = loadConfig(`webpack/webpack.${PRODUCTION ? 'prod' : 'dev'}.js`);