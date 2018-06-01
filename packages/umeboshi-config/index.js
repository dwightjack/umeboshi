const paths = require('./paths');
const hosts = require('./hosts');
const jest = require('./jest.config');
const customizr = require('./modernizr/prod');
const modernizr = require('./modernizr/dev');
const devServer = require('./server/dev');

module.exports = (config, { production, analyze }) => {

    config.merge({
        hosts,
        paths,
        jest,
        modernizr,
        customizr,
        devServer
    });

    const branch = analyze || production ? 'prod' : 'dev';

    config.set('webpack', require(`./webpack/webpack.${branch}`));
};