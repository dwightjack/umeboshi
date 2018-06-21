const webpack = require('webpack');
const { resolveConfig } = require('umeboshi-dev-utils');
const createConfig = require('umeboshi-dev-utils/lib/config');

const PRODUCTION = process.env.NODE_ENV === 'production';
const env = { production: PRODUCTION };
const { api } = resolveConfig(createConfig(env)).evaluate();

api.hooks.bundlerCompile.tap('bundlerLogger', (err, stats) => {
    if (err) {
        console.log(err);
    } else {
        console.log(stats.toString({
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
        console.log('Completed!');
    }
});

const webpackConfig = api.hooks.bundlerConfig.call(require('./webpack')(env), env);

webpack(webpackConfig, (err, stats) => {
    api.hooks.bundlerCompile.call(err, stats);
});