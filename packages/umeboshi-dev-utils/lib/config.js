const { evaluate, APP_PATH } = require('../index');
const paths = require('./paths');

const createConfig = () => {

    const $store = new Map();
    const $extends = new Map();

    return {
        get(key) {
            return $store.get(key);
        },
        set(key, value) {
            $store.set(key, value);
            return this;
        },
        has(key) {
            return $store.has(key);
        },
        delete(key) {
            $store.delete(key);
        },
        merge(obj) {
            Object.keys(obj).forEach((key) => {
                const value = obj[key];
                if (!this.has(key)) {
                    this.set(key, value);
                } else {
                    this.set(key, merge(this.get(key), value));
                }

            });
        },
        tap(key, fn) {
            if (!$extends.has(key)) {
                $extends.set(key, []);
            }
            $extends.get(key).push(fn);
            return this;
        },
        evaluate(env) {
            const api = {
                paths: paths(APP_PATH, evaluate(this.get('paths') || {}, env)),
                address: require('ip').address(),
                hosts: this.get('hosts') || {}
            };
            const config = [...$store].reduce((acc, [key, value]) => {
                const frag = evaluate(value, api, env);
                if ($extends.has(key)) {
                    $extends.get(key).reduce((f, fn) => {
                        fn(f, api, env);
                        return f;
                    }, frag)
                }
                acc[key] = frag

                return acc;
            }, {});
            return { api, config };
        }
    }
};

module.exports = createConfig;