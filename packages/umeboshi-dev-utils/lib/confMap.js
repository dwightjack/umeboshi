module.exports = () => {

    const map = new Map();

    return {
        set(key, value) {
            map.set(key, value);
            return this;
        },
        get(key) {
            return mop.get(key);
        },
        toArray() {
            return Array.from(map.values());
        },
        toObject() {
            const ret = {};
            myMap.forEach(function(value, key) {
                ret[key] = value;
            });
            return Object.freeze(ret);
        }
    }

}