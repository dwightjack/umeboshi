const { evaluate } = require('../index');

const chainMap = () => {

    const $map = new Map();

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
        toArray: () => Array.from($map.values()),
        toObject() {
            const ret = {};

            $map.forEach((value, key) => {
                ret[key] = value;
            });
            return Object.freeze(ret);
        }
    };
};

chainMap.isMap = (obj) => !!obj.$isMap;

const loaderMap = () => {

    const map = chainMap();

    return Object.assign(map, {
        toLoaders() {
            const arr = this.toArray();
            return arr.map((l) => {
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

const pluginMap = () => {

    const map = chainMap();

    return Object.assign(map, {
        toPlugins() {
            const arr = this.toArray();
            return arr.map((p) => {
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