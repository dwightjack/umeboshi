const path = require('path');
const glob = require('glob');
const get = require('lodash/get');
const merge = require('lodash/merge');

const EXCLUDE_REGEXP = /\.(js|css|scss|html|ejs|\*)$/;

const paths = (APP_PATH, config) => {
    const $paths = merge({}, config);

    return {
        get(frag) {
            if (frag) {
                return get($paths, frag);
            }
            return merge({}, $paths);
        },

        merge(obj) {
            merge($paths, obj);
        },

        translatePath(pathMatch) {
            return pathMatch.split('/').map(
                (frag) =>
                    //exclude common file extensions from path resolution
                    EXCLUDE_REGEXP.test(frag) || frag === '.'
                        ? frag
                        : get($paths, frag, frag)
            );
        },

        toPath(pathMatch) {
            return path.join(...this.translatePath(pathMatch));
        },

        toAbsPath(pathMatch) {
            return path.join(APP_PATH, ...this.translatePath(pathMatch));
        },

        assetsPath(match, assets = 'dist.assets/') {
            return glob.sync(match, { cwd: this.toAbsPath(assets) }).pop();
        }
    };
};

module.exports = paths;
