const Vue = require('vue');

Object.defineProperty(Vue.prototype, '$style', {
    enumerable: false,
    writable: false,
    value: require('identity-obj-proxy')
});
