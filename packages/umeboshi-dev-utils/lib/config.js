const merge = require('lodash/merge');
const { AsyncParallelHook, SyncBailHook, SyncHook } = require('tapable');
const { evaluate, APP_PATH } = require('../index');
const paths = require('./paths');

const createConfig = (env = {}) => {
    const $store = new Map();
    const $extends = new Map();

    $store.set('env', env);

    return {
        hooks: {
            devServer: new AsyncParallelHook(['options', 'env', 'api']),
            devServerStart: new SyncHook(['server', 'options']),
            bundlerAfterCompile: new SyncBailHook(['err', 'stats']),
            bundlerCompiler: new SyncHook(['compiler']),
            bundlerConfig: new SyncBailHook(['config', 'env', 'createConfig'])
        },

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

        resolveFrag(key, value, api, e) {
            const frag = evaluate(value, api, e);
            if ($extends.has(key)) {
                return $extends.get(key).reduce((f, fn) => {
                    return fn(f, api, e) || f;
                }, frag);
            }
            return frag;
        },
        evaluate() {
            const e = this.resolveFrag('env', this.get('env'));
            const api = {
                paths: paths(APP_PATH, evaluate(this.get('paths') || {}, e)),
                address: require('ip').address(),
                hosts: this.get('hosts') || {},
                hooks: this.hooks
            };
            const config = [...$store].reduce(
                (acc, [key, value]) => {
                    //exclude env, we already resolved it
                    if (key === 'env') {
                        return acc;
                    }

                    acc[key] = this.resolveFrag(key, value, api, e);

                    return acc;
                },
                { env: e }
            );
            return { api, config };
        }
    };
};

module.exports = createConfig;
