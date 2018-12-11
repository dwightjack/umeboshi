const paths = require('./paths');
const hosts = require('./hosts');
const jest = require('./jest.config');
const customizr = require('./modernizr/prod');
const modernizr = require('./modernizr/dev');
const devServer = require('./server/dev');

module.exports = (config, { modernBuild = false }) => {
    config.tap('env', (env) => {
        return Object.assign(env, {
            modernBuild
        });
    });

    config.merge({
        hosts,
        paths,
        jest,
        modernizr,
        customizr,
        devServer
    });

    config.set('webpack', require('./webpack'));
};
