const webpack = require('webpack');
const { resolveConfig } = require('umeboshi-dev-utils');
const identity = require('lodash/identity');
const logger = require('umeboshi-dev-utils/lib/logger');
const createConfig = require('umeboshi-dev-utils/lib/config');

const PRODUCTION = process.env.NODE_ENV === 'production';
const env = { production: PRODUCTION, analyze: process.env.WEBPACK_ANALYZE };
const { api } = resolveConfig(createConfig(env)).evaluate();

api.hooks.bundlerConfig.tap('bundlerConfig', identity);
api.hooks.bundlerCompiler.tap('bundlerConfig', identity);
api.hooks.bundlerAfterCompile.tap('bundlerLogger', (err, stats) => {
    if (err) {
        logger.error(`An Error occurred while compiling the bundle: ${err}`);
    } else {
        logger.log(stats.toString({
            colors: true,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false,
            modules: false,
            children: true,
            version: true,
            cached: false,
            cachedAssets: false,
            reasons: false,
            source: false,
            errorDetails: false
        }));
        logger.message('Bundle created!');
    }
});


const webpackConfig = api.hooks.bundlerConfig.call(require('./webpack')(env), env);

logger.log('Starting bundle compilation...');

const compiler = webpack(webpackConfig, (err, stats) => {
    api.hooks.bundlerAfterCompile.call(err, stats);
});

api.hooks.bundlerCompiler.call(compiler);