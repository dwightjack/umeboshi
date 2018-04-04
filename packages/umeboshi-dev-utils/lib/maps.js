const { evaluate } = require('../index');

const chainMap = (src) => {

    const $map = new Map(src);

    return {
        $isMap: true,
        get: (key) => $map.get(key),
        has: (key) => $map.has(key),
        delete(key) {
            $map.delete(key);
            return this;
        },
        set(key, value) {
            $map.set(key, value);
            return this;
        },
        toArray: (mapFn) => Array.from($map.values(), mapFn),
        toObject() {
            const ret = {};

            $map.forEach((value, key) => {
                ret[key] = value;
            });
            return Object.freeze(ret);
        },
        clone() {
            const factory = this.$cloneFactory || chainMap;
            return factory($map);
        }
    };
};

chainMap.isMap = (obj) => !!obj.$isMap;

const loaderMap = (src) => {

    const map = chainMap(src);

    return Object.assign(map, {
        $cloneFactory: loaderMap,
        toLoaders() {
            return this.toArray((l) => {
                const loader = evaluate(l, map);
                const { use } = loader;
                if (use && chainMap.isMap(use)) {
                    loader.use = use.toLoaders();
                }
                return loader;
            });
        }
    });
};

const pluginMap = (src) => {

    const map = chainMap(src);

    return Object.assign(map, {
        $cloneFactory: pluginMap,
        toPlugins() {
            return this.toArray((p) => {
                const { plugin, options = [] } = evaluate(p, map);
                const opts = Array.isArray(options) ? options : [options];
                return new plugin(...opts); //eslint-disable-line new-cap
            });
        }
    });
};

module.exports = {
    pluginMap,
    loaderMap,
    chainMap
};