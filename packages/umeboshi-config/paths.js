const path = require('path');
const get = require('lodash/get');
const glob = require('glob');
const { APP_PATH } = require('umeboshi-scripts/lib/utils');

const paths = {

    src: {
        root: 'app',
        assets: 'app/assets'
    },

    dist: {
        root: 'public', //where static files are to be saved
        assets: 'public/assets'
    },

    publicPath: '/assets/',

    js: 'js',
    styles: 'styles',
    images: 'images',
    fonts: 'fonts',
    audio: 'audio',
    video: 'video',
    vendors: 'vendors',

    tmp: '.tmp'
};

module.exports = paths;

const translatePath = (pathMatch) => pathMatch.split('/').map((frag) => get(paths, frag, frag));

module.exports.toPath = (pathMatch) => path.join(...translatePath(pathMatch));

module.exports.toAbsPath = (pathMatch) => path.join(APP_PATH, ...translatePath(pathMatch));

module.exports.assetsPath = (match) => {
    const filepath = glob.sync(match, { cwd: paths.toAbsPath('dist.assets/') }).pop();
    return filepath;
};