const config = require('umeboshi-config/jest.config');

module.exports = Object.assign(config, {
    setupFiles: [require.resolve('./lib/jest.setup')]
});