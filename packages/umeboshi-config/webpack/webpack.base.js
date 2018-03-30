const { paths } = require('umeboshi-dev-utils');

const PRODUCTION = process.env.NODE_ENV === 'production';
const destPath = paths.toAbsPath('dist.assets');

module.exports = {
    context: process.cwd(),
    externals: {},
    entry: {},
    target: 'web', // Make web variables accessible to webpack, e.g. window,
    stats: {
        colors: true,
        hash: false,
        timings: true,
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
    },
    performance: {
        hints: false
    },
    devtool: (PRODUCTION ? '#source-map' : '#cheap-module-source-map'),
    output: {
        path: destPath,
        publicPath: paths.publicPath,
        chunkFilename: paths.js + '/[name].chunk.js',
        filename: paths.js + '/[name].js'
    },
    plugins: [],
    module: {
        rules: [
            { parser: { amd: false } }
        ]
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    resolve: {
        alias: {
            styles: paths.toAbsPath('src.assets/styles'),
            images: paths.toAbsPath('src.assets/images'),
            '@': paths.toAbsPath('src.assets/js')
        },
        modules: ['node_modules', paths.toAbsPath('src.assets/vendors')]
    }
};