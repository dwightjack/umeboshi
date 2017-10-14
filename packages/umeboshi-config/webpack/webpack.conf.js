const { loadConfig } = require('umeboshi-scripts/lib/utils');

const PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = loadConfig(`webpack/webpack.${PRODUCTION ? 'prod' : 'dev'}.js`);